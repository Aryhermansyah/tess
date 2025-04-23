import { ensureDirectoriesExist } from './fileStorage';
import { Alert } from 'react-native';

/**
 * Initialize the application by setting up required directories
 * and performing any other startup tasks
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Initializing app...');
    
    // Ensure local storage directories exist
    await ensureDirectoriesExist();
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error initializing app:', error);
    Alert.alert(
      'Initialization Error',
      'There was a problem setting up the app. Some features may not work correctly.',
      [{ text: 'OK' }]
    );
  }
};
