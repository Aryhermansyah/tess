import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

// Key for storing images in AsyncStorage
const WEB_IMAGES_STORAGE_KEY = 'wedding_app_images';

interface WebImageStorageProps {
  onReady?: () => void;
}

/**
 * Component that handles image storage for web platform
 * This is a hidden component that manages the persistence of images
 * across browser sessions by syncing with localStorage
 */
export const WebImageStorage: React.FC<WebImageStorageProps> = ({ onReady }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        // Check if we have images in AsyncStorage
        const storedImages = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY);
        
        if (!storedImages) {
          // Initialize with empty object
          await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify({}));
        } else {
          // Parse the stored images
          const imagesData = JSON.parse(storedImages);
          console.log(`Loaded ${Object.keys(imagesData).length} images from storage`);
          
          // Here we could sync with a server or perform other operations
        }
        
        setInitialized(true);
        if (onReady) onReady();
      } catch (error) {
        console.error('Error initializing web image storage:', error);
        // Initialize with empty object on error
        await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify({}));
        setInitialized(true);
        if (onReady) onReady();
      }
    };
    
    initializeStorage();
  }, []);

  // This component doesn't render anything visible
  return null;
};

/**
 * Hook to access web image storage
 * Returns functions to get, set, and list images
 */
export const useWebImageStorage = () => {
  const [images, setImages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // Load images from storage
  const loadImages = async () => {
    try {
      setLoading(true);
      const storedImages = await AsyncStorage.getItem(WEB_IMAGES_STORAGE_KEY);
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Save an image to storage
  const saveImage = async (key: string, imageData: any) => {
    try {
      const updatedImages = { ...images, [key]: imageData };
      await AsyncStorage.setItem(WEB_IMAGES_STORAGE_KEY, JSON.stringify(updatedImages));
      setImages(updatedImages);
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  };
  
  // Get all images
  const getAllImages = () => {
    return Object.entries(images).map(([key, data]) => ({
      key,
      ...data,
    }));
  };
  
  // Get a specific image
  const getImage = (key: string) => {
    return images[key];
  };
  
  // Initialize by loading images
  useEffect(() => {
    loadImages();
  }, []);
  
  return {
    images,
    loading,
    loadImages,
    saveImage,
    getAllImages,
    getImage,
  };
};

export default WebImageStorage;
