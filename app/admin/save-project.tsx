import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SaveProjectForm } from '@/components/admin/SaveProjectForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function SaveProjectScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <AdminPageHeader 
        title="Simpan Proyek" 
        subtitle="Ekspor proyek untuk deployment"
        backRoute="/admin/dashboard"
      />
      <SaveProjectForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}); 