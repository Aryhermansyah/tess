import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/shared/Card';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { 
  Users, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  UserCheck, 
  Palette, 
  Settings,
  ClipboardList,
  LogOut,
  Save
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export const AdminMenu: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Pasangan',
      icon: <Users size={24} color={colors.primary} />,
      route: '/admin/couple',
      description: 'Edit informasi pasangan pengantin'
    },
    {
      title: 'Jadwal',
      icon: <Calendar size={24} color={colors.primary} />,
      route: '/admin/schedule',
      description: 'Atur jadwal acara pernikahan'
    },
    {
      title: 'Lokasi',
      icon: <MapPin size={24} color={colors.primary} />,
      route: '/admin/venue',
      description: 'Edit lokasi dan alamat acara'
    },
    {
      title: 'Vendor',
      icon: <ShoppingBag size={24} color={colors.primary} />,
      route: '/admin/vendors',
      description: 'Kelola daftar vendor pernikahan'
    },
    {
      title: 'Panitia',
      icon: <Users size={24} color={colors.primary} />,
      route: '/admin/committee',
      description: 'Atur daftar panitia pernikahan'
    },
    {
      title: 'Koordinator',
      icon: <UserCheck size={24} color={colors.primary} />,
      route: '/admin/coordinators',
      description: 'Kelola koordinator acara'
    },
    {
      title: 'Moodboard',
      icon: <Palette size={24} color={colors.primary} />,
      route: '/admin/moodboard',
      description: 'Atur inspirasi visual pernikahan'
    },
    {
      title: 'Tema',
      icon: <Palette size={24} color={colors.primary} />,
      route: '/admin/theme',
      description: 'Ubah tema dan warna undangan'
    },
    {
      title: 'Rangkuman Acara',
      icon: <ClipboardList size={24} color={colors.primary} />,
      route: '/admin/event-summary',
      description: 'Edit rangkuman informasi acara'
    },
    {
      title: 'Simpan Proyek',
      icon: <Save size={24} color={colors.primary} />,
      route: '/admin/save-project',
      description: 'Simpan proyek untuk deployment'
    },
    {
      title: 'Pengaturan',
      icon: <Settings size={24} color={colors.primary} />,
      route: '/admin/settings',
      description: 'Pengaturan aplikasi dan undangan'
    }
  ];

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard Admin</Text>
      <Text style={styles.subheading}>Kelola semua informasi pernikahan Anda</Text>
      
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <Card style={styles.menuCard}>
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={colors.white} />
        <Text style={styles.logoutText}>Kembali ke Undangan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  heading: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
    marginBottom: 8,
  },
  subheading: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuItem: {
    width: isSmallScreen ? '100%' : '48%',
    marginBottom: 16,
  },
  menuCard: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  menuDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
    gap: 8,
  },
  logoutText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.white,
    fontWeight: '600',
  },
});