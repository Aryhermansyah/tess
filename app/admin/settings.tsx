import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useAuthStore } from '@/store/auth-store';
import { useWeddingStore } from '@/store/wedding-store';
import { RefreshCw, LogOut, AlertTriangle } from 'lucide-react-native';
import DataExporter from '@/components/admin/DataExporter';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const resetToDefault = useWeddingStore((state) => state.resetToDefault);

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.replace('/admin');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'Apakah Anda yakin ingin mengatur ulang semua data pernikahan ke nilai default? Tindakan ini tidak dapat dibatalkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            resetToDefault();
            Alert.alert('Sukses', 'Semua data telah diatur ulang ke nilai default.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Text style={styles.title}>Pengaturan</Text>
          <Text style={styles.subtitle}>Kelola pengaturan website pernikahan Anda</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Akun</Text>
            <Button
              title="Keluar"
              onPress={handleLogout}
              variant="outline"
              icon={<LogOut size={18} color={colors.primary} />}
              style={styles.button}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manajemen Data</Text>
            <Button
              title="Reset ke Data Default"
              onPress={handleResetData}
              variant="outline"
              icon={<RefreshCw size={18} color={colors.primary} />}
              style={styles.button}
            />
            
            <View style={styles.warningContainer}>
              <AlertTriangle size={18} color={colors.error} />
              <Text style={styles.warningText}>
                Peringatan: Mengatur ulang data akan menghapus semua kustomisasi Anda dan mengembalikan informasi pernikahan default.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GitHub & Ekspor Data</Text>
            <DataExporter />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang</Text>
            <Text style={styles.aboutText}>
              Admin Website Pernikahan v1.0.0
            </Text>
            <Text style={styles.aboutText}>
              Dibuat dengan React Native dan Expo
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: colors.error + '10',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  warningText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.error,
    flex: 1,
  },
  aboutText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 8,
  },
});