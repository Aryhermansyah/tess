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

import { supabase } from '../utils/supabaseClient';

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

  // Supabase sync state
  const [supabaseLoading, setSupabaseLoading] = React.useState(true);
  const [supabaseError, setSupabaseError] = React.useState<string | null>(null);

  // Fetch all wedding data from Supabase on mount & subscribe to realtime updates
  useEffect(() => {
    let isMounted = true;
    setSupabaseLoading(true);
    setSupabaseError(null);

    // Helper: fetch and update store
    async function fetchAndUpdateStore({ table, updateFn, single = false }) {
      const sel = single ? '*': '*';
      const query = supabase.from(table).select(sel);
      const { data, error } = single ? await query.single() : await query;
      if (error) {
        setSupabaseError(`Error fetching ${table}: ${error.message}`);
        return;
      }
      if (data && isMounted) updateFn(data);
    }

    // Fetch all tables
    Promise.all([
      fetchAndUpdateStore({ table: 'admin_core', updateFn: (d) => { core.updateCouple(d.couple); core.updateVenue(d.venue); core.updateTheme(d.theme); }, single: true }),
      fetchAndUpdateStore({ table: 'schedule', updateFn: schedule.updateSchedule }),
      fetchAndUpdateStore({ table: 'committee', updateFn: committee.updateCommittee }),
      fetchAndUpdateStore({ table: 'vendors', updateFn: vendors.updateVendors }),
      fetchAndUpdateStore({ table: 'coordinators', updateFn: coordinators.updateCoordinators }),
      fetchAndUpdateStore({ table: 'moodboard', updateFn: moodboard.updateMoodboard }),
      fetchAndUpdateStore({ table: 'event_summary', updateFn: eventSummary.updateEventSummary, single: true }),
    ]).finally(() => setSupabaseLoading(false));

    // Realtime listeners for all tables
    const channels = [
      { table: 'admin_core', fn: () => fetchAndUpdateStore({ table: 'admin_core', updateFn: (d) => { core.updateCouple(d.couple); core.updateVenue(d.venue); core.updateTheme(d.theme); }, single: true }) },
      { table: 'schedule', fn: () => fetchAndUpdateStore({ table: 'schedule', updateFn: schedule.updateSchedule }) },
      { table: 'committee', fn: () => fetchAndUpdateStore({ table: 'committee', updateFn: committee.updateCommittee }) },
      { table: 'vendors', fn: () => fetchAndUpdateStore({ table: 'vendors', updateFn: vendors.updateVendors }) },
      { table: 'coordinators', fn: () => fetchAndUpdateStore({ table: 'coordinators', updateFn: coordinators.updateCoordinators }) },
      { table: 'moodboard', fn: () => fetchAndUpdateStore({ table: 'moodboard', updateFn: moodboard.updateMoodboard }) },
      { table: 'event_summary', fn: () => fetchAndUpdateStore({ table: 'event_summary', updateFn: eventSummary.updateEventSummary, single: true }) },
    ].map(({ table, fn }) =>
      supabase.channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, fn)
        .subscribe()
    );

    return () => {
      isMounted = false;
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  // Foto/image: Semua data yang memiliki field foto/image harus menyimpan url Supabase Storage
  // (Pastikan saat upload foto dari admin, file di-upload ke Supabase Storage dan url-nya disimpan di tabel)
  // Di halaman utama, gunakan url dari field foto/image untuk menampilkan gambar dari Supabase Storage.

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