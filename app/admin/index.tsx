import React from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LoginForm } from '@/components/admin/LoginForm';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useAuthStore } from '@/store/auth-store';

export default function AdminLoginScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.primaryLight, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Admin Pernikahan</Text>
          <Text style={styles.subtitle}>Kelola detail pernikahan Anda</Text>
          
          <LoginForm />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Butuh bantuan? Hubungi support di support@wedding.com
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxxl,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 32,
  },
  footer: {
    marginTop: 48,
  },
  footerText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
  },
});