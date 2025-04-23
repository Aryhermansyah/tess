import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Platform, useColorScheme, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { initializeApp } from '@/utils/initApp';
import WebImageStorage from '@/components/shared/WebImageStorage';
import { 
  useWeddingCoreStore, 
  useWeddingScheduleStore, 
  useWeddingCommitteeStore,
  useWeddingVendorsStore,
  useWeddingCoordinatorsStore,
  useWeddingMoodboardStore,
  useWeddingEventSummaryStore
} from '@/store/wedding-store';
import { injectAnimationStyles } from '@/styles/animations';

export default function Layout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  
  // Initialize all stores to ensure they're loaded on app start
  const core = useWeddingCoreStore();
  const schedule = useWeddingScheduleStore();
  const committee = useWeddingCommitteeStore();
  const vendors = useWeddingVendorsStore();
  const coordinators = useWeddingCoordinatorsStore();
  const moodboard = useWeddingMoodboardStore();
  const eventSummary = useWeddingEventSummaryStore();

  // Initialize app and log stores loaded status for debugging
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize local file system
        await initializeApp();
        
        console.log('Core store loaded:', !!core);
        console.log('Schedule store loaded:', !!schedule);
        console.log('Committee store loaded:', !!committee);
        console.log('Vendors store loaded:', !!vendors);
        console.log('Coordinators store loaded:', !!coordinators);
        console.log('Moodboard store loaded:', !!moodboard);
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    init();
  }, []);

  // Inject animation styles for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      injectAnimationStyles();
      
      // Tambahkan class animasi ke body document
      document.body.classList.add('animate-fade-in');
    }
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      {Platform.OS === 'web' && <WebImageStorage />}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: fonts.heading.fontFamily,
            fontWeight: fonts.heading.fontWeight as "bold",
            color: colors.primary,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.lg,
    color: colors.primary,
    marginTop: 12,
  },
});