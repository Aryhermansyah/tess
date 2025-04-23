import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define base directory for our app's files
const APP_DIRECTORY = Platform.OS === 'web' 
  ? './assets/wedding_app/' // For web, use a relative path in the project's public directory
  : FileSystem.documentDirectory + 'wedding_app/';

const IMAGES_DIRECTORY = APP_DIRECTORY + 'images/';

// For web platform, we'll use a different approach to store images
const WEB_IMAGES_STORAGE_KEY = 'wedding_app_images';

// Ensure directories exist
export const ensureDirectoriesExist = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // For web, we'll use a different approach
      console.log('Web platform detected, using AsyncStorage for images');
      // Initialize web images storage if needed
      const imagesData = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY);
      if (!imagesData) {
        await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify({}));
      }
      return;
    }
    
    // For native platforms, create directories
    const appDirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
    if (!appDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
    }
    
    const imagesDirInfo = await FileSystem.getInfoAsync(IMAGES_DIRECTORY);
    if (!imagesDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGES_DIRECTORY, { intermediates: true });
    }
  } catch (error) {
    console.error('Error ensuring directories exist:', error);
    throw error;
  }
};

// Save an image to local storage
export const saveImageToLocalStorage = async (
  imageUri: string,
  category: string = 'misc'
): Promise<string> => {
  try {
    await ensureDirectoriesExist();
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const randomString = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${imageUri}${timestamp}`
    );
    const filename = `${category}_${timestamp}_${randomString.substring(0, 8)}`;
    const extension = imageUri.split('.').pop() || 'jpg';
    
    // Handle web platform differently
    if (Platform.OS === 'web') {
      // For web, we'll store the image data in AsyncStorage
      const imageKey = `${filename}.${extension}`;
      const imagePath = `/assets/wedding_app/images/${imageKey}`;
      
      // Create a physical file in the public directory
      if (imageUri.startsWith('data:')) {
        // Store data URI directly
        try {
          // Get existing images data
          const imagesDataJson = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY) || '{}';
          const imagesData = JSON.parse(imagesDataJson);
          
          // Add new image
          imagesData[imageKey] = {
            uri: imageUri,
            category,
            timestamp,
            path: imagePath
          };
          
          // Save updated data
          await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify(imagesData));
          
          console.log(`Web image saved with key ${imageKey}`);
          return imagePath;
        } catch (storageError) {
          console.error('Error storing web image:', storageError);
          return imageUri;
        }
      }
      
      // For URLs, we'll store the reference
      if (imageUri.startsWith('http')) {
        // Get existing images data
        const imagesDataJson = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY) || '{}';
        const imagesData = JSON.parse(imagesDataJson);
        
        // Add new image reference
        imagesData[imageKey] = {
          uri: imageUri, // Store original URL
          category,
          timestamp,
          path: imagePath,
          isExternal: true
        };
        
        // Save updated data
        await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify(imagesData));
        
        console.log(`Web image reference saved with key ${imageKey}`);
        return imageUri; // Return original URL for external images
      }
      
      return imageUri;
    }
    
    // For native platforms, continue with file system approach
    const localUri = `${IMAGES_DIRECTORY}${filename}.${extension}`;
    
    // Handle different URI formats
    let sourceUri = imageUri;
    if (imageUri.startsWith('file://')) {
      // Local file URI, can be copied directly
      sourceUri = imageUri;
    } else if (imageUri.startsWith('http')) {
      // Download from remote URL
      const downloadResult = await FileSystem.downloadAsync(
        imageUri,
        localUri
      );
      return downloadResult.uri;
    }
    
    // Copy the file to our app directory
    await FileSystem.copyAsync({
      from: sourceUri,
      to: localUri
    });
    
    console.log(`Image saved to ${localUri}`);
    return localUri;
  } catch (error) {
    console.error('Error saving image:', error);
    // If there's an error, return the original URI as fallback
    return imageUri;
  }
};

// Get a file path that's relative to the app directory
// This makes paths more portable for GitHub
export const getRelativePath = (absolutePath: string): string => {
  if (!absolutePath) return '';
  if (Platform.OS === 'web') {
    // For web, handle paths differently
    if (absolutePath.startsWith('/assets/wedding_app/')) {
      return absolutePath.replace('/assets/wedding_app/', '');
    }
  } else if (absolutePath.startsWith(APP_DIRECTORY)) {
    return absolutePath.replace(APP_DIRECTORY, '');
  }
  return absolutePath;
};

// Convert a relative path back to absolute
export const getAbsolutePath = (relativePath: string): string => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
    return relativePath; // Already an external URL or data URI
  }
  
  if (Platform.OS === 'web') {
    // For web, prepend the correct path
    if (!relativePath.startsWith('/assets/')) {
      return `/assets/wedding_app/${relativePath}`;
    }
    return relativePath;
  }
  
  return `${APP_DIRECTORY}${relativePath}`;
};

// Delete a file from local storage
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      console.log(`File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Export a list of all saved images
export const getAllSavedImages = async (): Promise<string[]> => {
  try {
    await ensureDirectoriesExist();
    
    if (Platform.OS === 'web') {
      // For web, get images from AsyncStorage
      const imagesDataJson = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY) || '{}';
      const imagesData = JSON.parse(imagesDataJson);
      return Object.keys(imagesData).map(key => imagesData[key].path);
    }
    
    // For native platforms
    const result = await FileSystem.readDirectoryAsync(IMAGES_DIRECTORY);
    return result.map(filename => `${IMAGES_DIRECTORY}${filename}`);
  } catch (error) {
    console.error('Error getting saved images:', error);
    return [];
  }
};

// Export app data for GitHub
export const exportAppData = async (): Promise<string> => {
  try {
    await ensureDirectoriesExist();
    
    let appData: any = {
      timestamp: new Date().toISOString(),
      images: await getAllSavedImages().then(images => 
        images.map(img => getRelativePath(img))
      ),
    };
    
    if (Platform.OS === 'web') {
      // For web, include the full image data
      const imagesDataJson = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY) || '{}';
      appData.webImages = JSON.parse(imagesDataJson);
    }
    
    // Save the export data to a JSON file
    let exportPath: string;
    
    if (Platform.OS === 'web') {
      exportPath = '/assets/wedding_app/export_data.json';
      // For web, we'll store in AsyncStorage
      await AsyncStorage.setItem('wedding_app_export', JSON.stringify(appData, null, 2));
    } else {
      exportPath = `${APP_DIRECTORY}export_data.json`;
      await FileSystem.writeAsStringAsync(
        exportPath,
        JSON.stringify(appData, null, 2)
      );
    }
    
    return exportPath;
  } catch (error) {
    console.error('Error exporting app data:', error);
    throw error;
  }
};
