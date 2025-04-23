import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, Platform } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { Divider } from '@/components/shared/Divider';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { Couple } from '@/types';
import { fonts } from '@/constants/fonts';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockWeddingData } from '@/constants/mockData';

export const CoupleForm: React.FC = () => {
  // Menggunakan useWeddingCoreStore langsung untuk menghindari masalah dengan useWeddingStore
  const couple = useWeddingCoreStore(state => state.couple);
  const updateCouple = useWeddingCoreStore(state => state.updateCouple);
  
  // Inisialisasi dengan nilai default jika couple undefined
  const defaultCouple = mockWeddingData.couple;
  const [formData, setFormData] = useState<Couple>(couple || defaultCouple);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Update formData ketika couple berubah
  useEffect(() => {
    if (couple) {
      setFormData(couple);
    }
  }, [couple]);

  const handleChange = (field: string, subfield: string, value: string) => {
    console.log(`Mengubah ${field}.${subfield} dengan nilai baru`);
    
    // Untuk foto, simpan langsung di localStorage
    if (subfield === 'photo') {
      console.log(`Menerima foto baru untuk ${field}`);
      
      // Simpan di localStorage untuk web
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`wedding_photo_${field}`, value);
        console.log(`Foto ${field} disimpan di localStorage`);
      }
    }
    
    // Update state dengan nilai baru
    setFormData({
      ...formData,
      [field]: {
        ...formData[field as keyof Couple],
        [subfield]: value,
      },
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    
    try {
      console.log('Menyimpan data pasangan...');
      
      // Simpan data langsung ke store
      updateCouple(formData);
      
      // Simpan foto ke localStorage untuk memastikan tersimpan
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        if (formData.groom.photo) {
          window.localStorage.setItem('wedding_photo_groom', formData.groom.photo);
        }
        if (formData.bride.photo) {
          window.localStorage.setItem('wedding_photo_bride', formData.bride.photo);
        }
      }
      
      // Tampilkan pesan sukses
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Log untuk debugging
      console.log('Data pasangan berhasil disimpan');
    } catch (error) {
      console.error('Error menyimpan data pasangan:', error);
      Alert.alert('Error', 'Gagal menyimpan data pengantin. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const successMessage = (
    <View style={styles.successContainer}>
      <Text style={[styles.successText, { fontWeight: 'bold' as const }]}>Data berhasil disimpan!</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Informasi Pasangan</Text>
        <Text style={styles.subtitle}>Perbarui detail pengantin pria dan wanita</Text>

        {success && successMessage}

        <Text style={styles.sectionTitle}>Pengantin Pria</Text>
        <Input
          label="Nama Panggilan"
          value={formData.groom.name}
          onChangeText={(value) => handleChange('groom', 'name', value)}
          placeholder="Nama panggilan pengantin pria"
        />
        <Input
          label="Nama Lengkap"
          value={formData.groom.fullName}
          onChangeText={(value) => handleChange('groom', 'fullName', value)}
          placeholder="Nama lengkap dengan gelar"
        />
        <Input
          label="Nama Panggilan"
          value={formData.groom.nickname}
          onChangeText={(value) => handleChange('groom', 'nickname', value)}
          placeholder="Nama panggilan sehari-hari"
        />
        <Input
          label="Nama Ibu"
          value={formData.groom.motherName}
          onChangeText={(value) => handleChange('groom', 'motherName', value)}
          placeholder="Nama ibu"
        />
        <Input
          label="Nama Ayah"
          value={formData.groom.fatherName}
          onChangeText={(value) => handleChange('groom', 'fatherName', value)}
          placeholder="Nama ayah"
        />
        <Input
          label="Posisi Saudara"
          value={formData.groom.siblingPosition}
          onChangeText={(value) => handleChange('groom', 'siblingPosition', value)}
          placeholder="Contoh: Anak pertama dari 3 bersaudara"
        />
        <Input
          label="Alamat"
          value={formData.groom.address}
          onChangeText={(value) => handleChange('groom', 'address', value)}
          placeholder="Alamat pengantin pria"
        />
        <Input
          label="Jumlah Saudara"
          value={formData.groom.siblings.toString()}
          onChangeText={(value) => handleChange('groom', 'siblings', value)}
          keyboardType="numeric"
          placeholder="Jumlah saudara"
        />
        <Input
          label="Nomor Telepon"
          value={formData.groom.phone}
          onChangeText={(value) => handleChange('groom', 'phone', value)}
          placeholder="Nomor telepon"
          keyboardType="phone-pad"
        />
        <ImagePicker
          label="Foto Pengantin Pria"
          value={formData.groom.photo}
          onImageSelected={(value) => handleChange('groom', 'photo', value)}
          placeholder="Pilih foto pengantin pria"
          maxSizeKB={100} // Reduced size limit further
          category="groom" // Kategori spesifik untuk foto pengantin pria
        />
        <Input
          label="Instagram"
          value={formData.groom.instagram}
          onChangeText={(value) => handleChange('groom', 'instagram', value)}
          placeholder="Akun Instagram pengantin pria"
        />

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Pengantin Wanita</Text>
        <Input
          label="Nama Panggilan"
          value={formData.bride.name}
          onChangeText={(value) => handleChange('bride', 'name', value)}
          placeholder="Nama panggilan pengantin wanita"
        />
        <Input
          label="Nama Lengkap"
          value={formData.bride.fullName}
          onChangeText={(value) => handleChange('bride', 'fullName', value)}
          placeholder="Nama lengkap dengan gelar"
        />
        <Input
          label="Nama Panggilan"
          value={formData.bride.nickname}
          onChangeText={(value) => handleChange('bride', 'nickname', value)}
          placeholder="Nama panggilan sehari-hari"
        />
        <Input
          label="Nama Ibu"
          value={formData.bride.motherName}
          onChangeText={(value) => handleChange('bride', 'motherName', value)}
          placeholder="Nama ibu"
        />
        <Input
          label="Nama Ayah"
          value={formData.bride.fatherName}
          onChangeText={(value) => handleChange('bride', 'fatherName', value)}
          placeholder="Nama ayah"
        />
        <Input
          label="Posisi Saudara"
          value={formData.bride.siblingPosition}
          onChangeText={(value) => handleChange('bride', 'siblingPosition', value)}
          placeholder="Contoh: Anak kedua dari 4 bersaudara"
        />
        <Input
          label="Alamat"
          value={formData.bride.address}
          onChangeText={(value) => handleChange('bride', 'address', value)}
          placeholder="Alamat pengantin wanita"
        />
        <Input
          label="Jumlah Saudara"
          value={formData.bride.siblings.toString()}
          onChangeText={(value) => handleChange('bride', 'siblings', value)}
          keyboardType="numeric"
          placeholder="Jumlah saudara"
        />
        <Input
          label="Nomor Telepon"
          value={formData.bride.phone}
          onChangeText={(value) => handleChange('bride', 'phone', value)}
          placeholder="Nomor telepon"
          keyboardType="phone-pad"
        />
        <ImagePicker
          label="Foto Pengantin Wanita"
          value={formData.bride.photo}
          onImageSelected={(value) => handleChange('bride', 'photo', value)}
          placeholder="Pilih foto pengantin wanita"
          maxSizeKB={100} // Reduced size limit further
          category="bride" // Kategori spesifik untuk foto pengantin wanita
        />
        <Input
          label="Instagram"
          value={formData.bride.instagram}
          onChangeText={(value) => handleChange('bride', 'instagram', value)}
          placeholder="Akun Instagram pengantin wanita"
        />

        <Button
          title="Simpan Perubahan"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 8,
    fontFamily: fonts.heading.fontFamily,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    fontFamily: fonts.body.fontFamily,
    fontWeight: 'normal' as const,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 12,
    marginTop: 24,
    fontFamily: fonts.subheading.fontFamily,
    fontWeight: 'bold' as const,
  },
  divider: {
    marginVertical: 24,
  },
  button: {
    marginTop: 24,
  },
  successContainer: {
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center' as const,
    fontFamily: fonts.body.fontFamily,
  },
});