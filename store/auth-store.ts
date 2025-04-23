import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '@/types';
import { adminCredentials } from '@/constants/mockData';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: async (username: string, password: string) => {
        // In a real app, this would be an API call
        if (username === adminCredentials.username && password === adminCredentials.password) {
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, username: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error setting item in storage:', error);
            // Continue without persisting
          }
        },
        removeItem: async (name) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing item from storage:', error);
          }
        },
      })),
    }
  )
);