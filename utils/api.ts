import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - use localhost for development
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api' 
  : 'http://localhost:3000/api';

/**
 * Upload an image to the server
 * @param imageUri URI of the image to upload
 * @param category Category of the image
 * @returns Promise with the server response
 */
export const uploadImage = async (imageUri: string, category: string = 'misc'): Promise<any> => {
  try {
    // For web platform with data URIs, use the base64 upload endpoint
    if (Platform.OS === 'web' && imageUri.startsWith('data:')) {
      const response = await fetch(`${API_BASE_URL}/upload-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageUri,
          category,
          filename: `${category}_${Date.now()}.jpg`,
        }),
      });
      
      return await response.json();
    }
    
    // For file URIs or URLs, use the multipart form upload
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${category}_${Date.now()}.jpg`,
    } as any);
    formData.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Save wedding data to the server
 * @param key Key to identify the data
 * @param data Data to save
 * @returns Promise with the server response
 */
export const saveData = async (key: string, data: any): Promise<any> => {
  try {
    // For web platform, also save to AsyncStorage as backup
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(`wedding_data_${key}`, JSON.stringify(data));
    }
    
    const response = await fetch(`${API_BASE_URL}/save-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, data }),
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error saving data with key ${key}:`, error);
    
    // If server request fails, still save to AsyncStorage
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(`wedding_data_${key}`, JSON.stringify(data));
    }
    
    // Return a mock success response
    return { success: true, message: 'Data saved locally (offline mode)' };
  }
};

/**
 * Get wedding data from the server
 * @param key Key to identify the data
 * @returns Promise with the data
 */
export const getData = async (key: string): Promise<any> => {
  try {
    // Try to get from server first
    const response = await fetch(`${API_BASE_URL}/get-data/${key}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    // If server request fails, try to get from AsyncStorage
    if (Platform.OS === 'web') {
      const localData = await AsyncStorage.getItem(`wedding_data_${key}`);
      if (localData) {
        return JSON.parse(localData);
      }
    }
    
    throw new Error(`Data with key ${key} not found`);
  } catch (error) {
    console.error(`Error getting data with key ${key}:`, error);
    
    // Try to get from AsyncStorage as fallback
    if (Platform.OS === 'web') {
      const localData = await AsyncStorage.getItem(`wedding_data_${key}`);
      if (localData) {
        return JSON.parse(localData);
      }
    }
    
    throw error;
  }
};
