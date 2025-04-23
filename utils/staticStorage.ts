import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Direktori untuk menyimpan data dan gambar
const STATIC_IMAGES_DIR = './assets/images/';
const STATIC_DATA_DIR = './assets/data/';

// Kunci untuk menyimpan data di AsyncStorage
const STORAGE_KEYS = {
  IMAGES: 'wedding_app_images',
  DATA: 'wedding_app_data',
};

/**
 * Fungsi untuk menyimpan gambar sebagai file statis
 * @param imageUri URI gambar (bisa berupa data URI atau URL)
 * @param category Kategori gambar
 * @param filename Nama file (opsional)
 */
export const saveStaticImage = async (
  imageUri: string,
  category: string = 'misc',
  filename?: string
): Promise<string> => {
  try {
    // Generate nama file jika tidak disediakan
    const timestamp = new Date().getTime();
    const finalFilename = filename || `${category}_${timestamp}.jpg`;
    const staticPath = `${STATIC_IMAGES_DIR}${finalFilename}`;
    
    // Simpan referensi gambar di AsyncStorage
    const imagesData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
    
    // Tambahkan data gambar baru
    imagesData[finalFilename] = {
      uri: imageUri,
      path: staticPath,
      category,
      timestamp,
    };
    
    // Simpan kembali ke AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(imagesData));
    
    console.log(`Image reference saved: ${staticPath}`);
    return staticPath;
  } catch (error) {
    console.error('Error saving static image:', error);
    return imageUri; // Kembalikan URI asli jika terjadi kesalahan
  }
};

/**
 * Fungsi untuk mendapatkan semua gambar yang tersimpan
 */
export const getAllStaticImages = async (): Promise<any[]> => {
  try {
    const imagesData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
    return Object.entries(imagesData).map(([key, data]) => ({
      key,
      ...data,
    }));
  } catch (error) {
    console.error('Error getting static images:', error);
    return [];
  }
};

/**
 * Fungsi untuk menyimpan data sebagai file statis
 * @param key Kunci data
 * @param data Data yang akan disimpan
 */
export const saveStaticData = async (key: string, data: any): Promise<boolean> => {
  try {
    // Simpan data di AsyncStorage
    const allData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.DATA) || '{}');
    
    // Tambahkan data baru
    allData[key] = {
      data,
      timestamp: new Date().toISOString(),
    };
    
    // Simpan kembali ke AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(allData));
    
    console.log(`Data saved with key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error saving data with key ${key}:`, error);
    return false;
  }
};

/**
 * Fungsi untuk mendapatkan data dari penyimpanan statis
 * @param key Kunci data
 */
export const getStaticData = async (key: string): Promise<any> => {
  try {
    const allData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.DATA) || '{}');
    return allData[key]?.data;
  } catch (error) {
    console.error(`Error getting data with key ${key}:`, error);
    return null;
  }
};

/**
 * Fungsi untuk mengekspor semua data dan gambar sebagai JSON
 * Ini akan digunakan untuk menyimpan data ke file statis yang bisa dicommit ke GitHub
 */
export const exportAllData = async (): Promise<string> => {
  try {
    const imagesData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
    const appData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.DATA) || '{}');
    
    const exportData = {
      timestamp: new Date().toISOString(),
      images: imagesData,
      data: appData,
    };
    
    // Untuk pengembangan, kita cetak data ke konsol
    console.log('Exported data:', JSON.stringify(exportData, null, 2));
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return JSON.stringify({ error: 'Failed to export data' });
  }
};

/**
 * Fungsi untuk mengimpor data dari file JSON
 * @param jsonData Data JSON yang akan diimpor
 */
export const importAllData = async (jsonData: string): Promise<boolean> => {
  try {
    const importedData = JSON.parse(jsonData);
    
    // Impor data gambar
    if (importedData.images) {
      await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(importedData.images));
    }
    
    // Impor data aplikasi
    if (importedData.data) {
      await AsyncStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(importedData.data));
    }
    
    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
