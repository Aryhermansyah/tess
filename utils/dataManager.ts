import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Kunci untuk menyimpan data di AsyncStorage
const STORAGE_KEYS = {
  WEDDING_DATA: 'wedding_data',
  IMAGES: 'wedding_images',
};

// Path ke file data statis
const STATIC_DATA_FILE = './assets/app-data.json';
const STATIC_IMAGES_DIR = './assets/images/';

/**
 * Fungsi untuk menyimpan data pernikahan
 * @param key Kunci data (misalnya 'couple', 'venue', dll)
 * @param data Data yang akan disimpan
 */
export const saveWeddingData = async (key: string, data: any): Promise<boolean> => {
  try {
    // Ambil data yang ada
    const existingDataStr = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DATA);
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
    
    // Update data dengan yang baru
    existingData[key] = {
      data,
      timestamp: new Date().toISOString(),
    };
    
    // Simpan kembali ke AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.WEDDING_DATA, JSON.stringify(existingData));
    
    // Simpan ke file statis jika di platform web
    if (Platform.OS === 'web') {
      await saveToStaticFile();
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving wedding data for key ${key}:`, error);
    return false;
  }
};

/**
 * Fungsi untuk mendapatkan data pernikahan
 * @param key Kunci data
 */
export const getWeddingData = async (key: string): Promise<any> => {
  try {
    // Coba ambil dari AsyncStorage
    const existingDataStr = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DATA);
    if (existingDataStr) {
      const existingData = JSON.parse(existingDataStr);
      if (existingData[key]) {
        return existingData[key].data;
      }
    }
    
    // Jika tidak ada di AsyncStorage, coba ambil dari file statis
    if (Platform.OS === 'web') {
      await loadFromStaticFile();
      
      // Coba lagi dari AsyncStorage setelah memuat dari file statis
      const reloadedDataStr = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DATA);
      if (reloadedDataStr) {
        const reloadedData = JSON.parse(reloadedDataStr);
        if (reloadedData[key]) {
          return reloadedData[key].data;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting wedding data for key ${key}:`, error);
    return null;
  }
};

/**
 * Fungsi untuk menyimpan gambar
 * @param imageUri URI gambar
 * @param category Kategori gambar
 * @param filename Nama file (opsional)
 */
export const saveImage = async (
  imageUri: string,
  category: string = 'misc',
  filename?: string
): Promise<string> => {
  try {
    console.log(`[saveImage] Menyimpan gambar untuk kategori: ${category}`);
    console.log(`[saveImage] URI gambar: ${imageUri.substring(0, 50)}...`);
    
    // Pastikan URI gambar valid
    if (!imageUri) {
      console.error('[saveImage] URI gambar tidak valid');
      return '';
    }
    
    // Generate nama file jika tidak disediakan
    const timestamp = new Date().getTime();
    const finalFilename = filename || `${category}_${timestamp}.jpg`;
    const staticPath = `${STATIC_IMAGES_DIR}${finalFilename}`;
    
    // Simpan langsung ke key khusus untuk kategori ini (untuk akses cepat)
    // Ini adalah yang paling penting untuk memastikan gambar segera terlihat
    await AsyncStorage.setItem(`image_${category}_latest`, imageUri);
    console.log(`[saveImage] Gambar disimpan di AsyncStorage dengan key: image_${category}_latest`);
    
    // Simpan juga di localStorage browser jika di platform web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      // Simpan URI gambar di localStorage browser
      window.localStorage.setItem(`wedding_image_${category}_latest`, imageUri);
      console.log(`[saveImage] Gambar disimpan di localStorage dengan key: wedding_image_${category}_latest`);
    }
    
    // Simpan referensi gambar di AsyncStorage (untuk persistensi)
    const imagesDataStr = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    const imagesData = imagesDataStr ? JSON.parse(imagesDataStr) : {};
    
    // Tambahkan data gambar baru
    imagesData[finalFilename] = {
      uri: imageUri,
      path: staticPath,
      category,
      timestamp,
    };
    
    // Simpan kembali ke AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(imagesData));
    console.log(`[saveImage] Referensi gambar disimpan di AsyncStorage`);
    
    // Simpan ke file statis jika di platform web
    if (Platform.OS === 'web') {
      try {
        await saveToStaticFile();
        console.log(`[saveImage] Data disimpan ke file statis`);
      } catch (staticError) {
        console.error('[saveImage] Error saving to static file:', staticError);
        // Lanjutkan meskipun ada error
      }
    }
    
    console.log(`[saveImage] Berhasil menyimpan gambar: ${staticPath}`);
    return imageUri; // Kembalikan URI asli agar bisa langsung ditampilkan
  } catch (error) {
    console.error('[saveImage] Error saving image:', error);
    return imageUri; // Kembalikan URI asli jika terjadi kesalahan
  }
};

/**
 * Fungsi untuk mendapatkan gambar berdasarkan path atau kategori
 * @param pathOrCategory Path gambar atau kategori gambar
 */
export const getImage = async (pathOrCategory: string): Promise<string | null> => {
  try {
    console.log(`[getImage] Mencari gambar untuk: ${pathOrCategory}`);
    
    // Jika pathOrCategory kosong, kembalikan null
    if (!pathOrCategory) {
      console.log('[getImage] Path atau kategori kosong');
      return null;
    }
    
    // Cek apakah path adalah URI lengkap
    if (pathOrCategory.startsWith('data:') || pathOrCategory.startsWith('http') || pathOrCategory.startsWith('file:')) {
      console.log('[getImage] URI lengkap terdeteksi, mengembalikan URI asli');
      return pathOrCategory;
    }
    
    // PRIORITAS 1: Coba ambil gambar terbaru untuk kategori ini dari AsyncStorage
    const latestImageUri = await AsyncStorage.getItem(`image_${pathOrCategory}_latest`);
    if (latestImageUri) {
      console.log(`[getImage] Gambar ditemukan di AsyncStorage dengan key: image_${pathOrCategory}_latest`);
      return latestImageUri;
    }
    
    // PRIORITAS 2: Coba ambil dari localStorage browser jika di platform web
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const webLatestImageUri = window.localStorage.getItem(`wedding_image_${pathOrCategory}_latest`);
      if (webLatestImageUri) {
        console.log(`[getImage] Gambar ditemukan di localStorage dengan key: wedding_image_${pathOrCategory}_latest`);
        
        // Simpan juga di AsyncStorage untuk konsistensi
        await AsyncStorage.setItem(`image_${pathOrCategory}_latest`, webLatestImageUri);
        
        return webLatestImageUri;
      }
    }
    
    // PRIORITAS 3: Coba ambil dari kumpulan data gambar di AsyncStorage
    const imagesDataStr = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    if (imagesDataStr) {
      const imagesData = JSON.parse(imagesDataStr);
      console.log(`[getImage] Mencari di kumpulan data gambar (${Object.keys(imagesData).length} item)`);
      
      // Cari berdasarkan filename
      const filename = pathOrCategory.split('/').pop();
      if (filename && imagesData[filename]) {
        console.log(`[getImage] Gambar ditemukan berdasarkan filename: ${filename}`);
        const foundUri = imagesData[filename].uri;
        
        // Simpan untuk akses cepat berikutnya
        await AsyncStorage.setItem(`image_${pathOrCategory}_latest`, foundUri);
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(`wedding_image_${pathOrCategory}_latest`, foundUri);
        }
        
        return foundUri;
      }
      
      // Cari berdasarkan kategori
      const matchingImages = Object.values(imagesData).filter(
        (img: any) => img.category === pathOrCategory
      ) as Array<{uri: string; path: string; category: string; timestamp: number}>;
      
      if (matchingImages.length > 0) {
        console.log(`[getImage] ${matchingImages.length} gambar ditemukan untuk kategori: ${pathOrCategory}`);
        
        // Ambil yang paling baru
        const latestImage = matchingImages.sort(
          (a, b) => b.timestamp - a.timestamp
        )[0];
        
        console.log(`[getImage] Menggunakan gambar terbaru dengan timestamp: ${latestImage.timestamp}`);
        
        // Simpan URI terbaru untuk kategori ini untuk akses cepat berikutnya
        await AsyncStorage.setItem(`image_${pathOrCategory}_latest`, latestImage.uri);
        
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(`wedding_image_${pathOrCategory}_latest`, latestImage.uri);
        }
        
        return latestImage.uri;
      }
    }
    
    // Jika tidak ditemukan, kembalikan path asli
    console.log(`[getImage] Gambar tidak ditemukan untuk ${pathOrCategory}, mengembalikan path asli`);
    return pathOrCategory;
  } catch (error) {
    console.error(`[getImage] Error getting image for path ${pathOrCategory}:`, error);
    return pathOrCategory; // Kembalikan path asli sebagai fallback
  }
};

/**
 * Fungsi untuk menyimpan semua data ke file statis
 * Ini akan digunakan untuk menyimpan data ke file JSON yang bisa dicommit ke GitHub
 */
export const saveToStaticFile = async (): Promise<boolean> => {
  try {
    // Ambil semua data dari AsyncStorage
    const weddingDataStr = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DATA);
    const imagesDataStr = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    
    const appData = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      data: weddingDataStr ? JSON.parse(weddingDataStr) : {},
      images: imagesDataStr ? JSON.parse(imagesDataStr) : {},
    };
    
    // Di platform web, kita tidak bisa langsung menulis ke file
    // Jadi kita cetak data ke konsol untuk debugging
    console.log('Data to save to static file:', JSON.stringify(appData, null, 2));
    
    // Untuk platform web, kita simpan di localStorage sebagai cadangan
    if (Platform.OS === 'web') {
      localStorage.setItem('wedding_app_data', JSON.stringify(appData));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving to static file:', error);
    return false;
  }
};

/**
 * Fungsi untuk memuat data dari file statis
 */
export const loadFromStaticFile = async (): Promise<boolean> => {
  try {
    // Di platform web, kita coba ambil dari localStorage
    if (Platform.OS === 'web') {
      const storedData = localStorage.getItem('wedding_app_data');
      if (storedData) {
        const appData = JSON.parse(storedData);
        
        // Simpan data ke AsyncStorage
        if (appData.data) {
          await AsyncStorage.setItem(STORAGE_KEYS.WEDDING_DATA, JSON.stringify(appData.data));
        }
        
        if (appData.images) {
          await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(appData.images));
        }
        
        console.log('Data loaded from localStorage');
        return true;
      }
    }
    
    // Jika tidak ada di localStorage atau bukan platform web,
    // kita bisa mencoba memuat dari file statis di masa depan
    
    return false;
  } catch (error) {
    console.error('Error loading from static file:', error);
    return false;
  }
};

/**
 * Fungsi untuk mengekspor semua data sebagai JSON
 * Ini akan digunakan untuk menyimpan data ke file yang bisa didownload
 */
export const exportAllData = async (): Promise<string> => {
  try {
    // Ambil semua data dari AsyncStorage
    const weddingDataStr = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DATA);
    const imagesDataStr = await AsyncStorage.getItem(STORAGE_KEYS.IMAGES);
    
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: weddingDataStr ? JSON.parse(weddingDataStr) : {},
      images: imagesDataStr ? JSON.parse(imagesDataStr) : {},
    };
    
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
    
    // Impor data pernikahan
    if (importedData.data) {
      await AsyncStorage.setItem(STORAGE_KEYS.WEDDING_DATA, JSON.stringify(importedData.data));
    }
    
    // Impor data gambar
    if (importedData.images) {
      await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(importedData.images));
    }
    
    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
