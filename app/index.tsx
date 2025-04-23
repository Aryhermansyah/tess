import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Hero } from '@/components/public/Hero';
import { CoupleInfo } from '@/components/public/CoupleInfo';
import { Schedule } from '@/components/public/Schedule';
import { Venue } from '@/components/public/Venue';
import { Committee } from '@/components/public/Committee';
import { Vendors } from '@/components/public/Vendors';
import { Coordinators } from '@/components/public/Coordinators';
import { EventSummary } from '@/components/public/EventSummary';
import { MoodboardPreview } from '@/components/public/MoodboardPreview';
import { Footer } from '@/components/public/Footer';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2, Settings, RefreshCw } from 'lucide-react-native';
import { 
  useWeddingCoreStore, 
  useWeddingScheduleStore, 
  useWeddingCommitteeStore,
  useWeddingVendorsStore,
  useWeddingCoordinatorsStore,
  useWeddingMoodboardStore,
  useWeddingEventSummaryStore
} from '@/store/wedding-store';

export default function Home() {
  const router = useRouter();
  
  // Initialize all stores to ensure they're loaded
  const core = useWeddingCoreStore();
  const schedule = useWeddingScheduleStore();
  const committee = useWeddingCommitteeStore();
  const vendors = useWeddingVendorsStore();
  const coordinators = useWeddingCoordinatorsStore();
  const moodboard = useWeddingMoodboardStore();
  const eventSummary = useWeddingEventSummaryStore();

  // Force refresh to ensure data is loaded
  const [refreshKey, setRefreshKey] = React.useState(0);

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
    Alert.alert(
      "Data Refreshed",
      "Halaman telah diperbarui dengan data terbaru.",
      [{ text: "OK" }]
    );
  };

  const clearAllData = async () => {
    Alert.alert(
      "Reset Data",
      "Apakah Anda yakin ingin menghapus semua data tersimpan? Ini akan mengembalikan aplikasi ke pengaturan awal.",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              // Get all keys with our prefixes
              const allKeys = await AsyncStorage.getAllKeys();
              const weddingKeys = allKeys.filter(key => 
                key.startsWith('core-') || 
                key.startsWith('schedule-') || 
                key.startsWith('committee-') || 
                key.startsWith('vendors-') || 
                key.startsWith('coordinators-') || 
                key.startsWith('moodboard-') ||
                key.startsWith('eventSummary-')
              );
              
              // Remove all wedding data
              if (weddingKeys.length > 0) {
                await AsyncStorage.multiRemove(weddingKeys);
                console.log('Cleared wedding data:', weddingKeys);
              }
              
              // Reset all stores to default values
              core.resetToDefault();
              schedule.resetToDefault();
              committee.resetToDefault();
              vendors.resetToDefault();
              coordinators.resetToDefault();
              moodboard.resetToDefault();
              eventSummary.resetToDefault();
              
              Alert.alert(
                "Data Reset",
                "Semua data telah dihapus. Aplikasi akan dimuat ulang.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Force reload the app
                      if (Platform.OS === 'web') {
                        window.location.reload();
                      } else {
                        // For native, we can't really "reload" the app, but we can navigate
                        setRefreshKey(prev => prev + 1);
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert(
                "Error",
                "Terjadi kesalahan saat menghapus data. Silakan coba lagi."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container} key={refreshKey}>
      <Stack.Screen 
        options={{
          title: 'Wedding Invitation',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            ...fonts.heading,
            color: colors.primary,
          },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={refreshData}
              >
                <RefreshCw size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={clearAllData}
              >
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={navigateToAdmin}
              >
                <Settings size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <Hero />
        <EventSummary />
        <CoupleInfo />
        <Schedule />
        <Committee />
        <Vendors />
        <Coordinators />
        <MoodboardPreview />
        <Venue />
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
});