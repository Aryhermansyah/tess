import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { WeddingTheme } from '@/types';
import { uploadImageToSupabase } from '@/utils/supabaseUpload';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

export const ThemeForm: React.FC = () => {
  const theme = useWeddingCoreStore((state) => state.theme);
  const updateTheme = useWeddingCoreStore((state) => state.updateTheme);
  
  const [formData, setFormData] = useState<WeddingTheme>(theme);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = async (field: keyof WeddingTheme, value: string) => {
    if (field === 'backgroundImage' && value && !value.startsWith('http')) {
      try {
        setLoading(true);
        const fileName = `theme_bg_${Date.now()}.jpg`;
        const url = await uploadImageToSupabase('wedding-images', value, fileName);
        if (url) {
          setFormData(prev => ({
            ...prev,
            [field]: url,
          }));
        } else {
          Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
        }
      } catch (err) {
        console.error('Gagal upload gambar tema:', err);
        Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
      } finally {
        setLoading(false);
      }
      return;
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simpan data ke Supabase
      const { error } = await supabase
        .from('admin_core')
        .upsert([{ theme: formData }], { onConflict: 'id' });
      if (error) {
        throw error;
      }
      updateTheme(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating theme data:', error);
      Alert.alert(
        'Gagal Menyimpan',
        'Terjadi kesalahan saat menyimpan data. Coba kurangi ukuran foto atau hapus beberapa data.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Tema Undangan</Text>
        <Text style={styles.subtitle}>Perbarui gambar latar undangan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Tema berhasil diperbarui!</Text>
          </View>
        )}

        <View style={styles.previewToggleContainer}>
          <Button
            title={previewMode ? "Edit Mode" : "Preview Mode"}
            onPress={() => setPreviewMode(!previewMode)}
            variant="secondary"
            style={styles.previewToggleButton}
          />
        </View>

        {previewMode ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview Tema</Text>
            <View style={styles.previewFrame}>
              <ImageWithFallback
                source={formData.backgroundImage}
                style={styles.previewBackground}
                fallbackType="decoration"
              />
              <View style={styles.previewOverlay}>
                <View style={styles.previewContent}>
                  <Text style={styles.previewHeading}>The Wedding Of</Text>
                  <Text style={styles.previewNames}>Franky & Katie</Text>
                  <Text style={styles.previewDate}>22 - FEB - 2022</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Gambar Latar</Text>
            <Text style={styles.sectionDescription}>
              Pilih gambar latar belakang untuk undangan. Disarankan menggunakan gambar dengan warna terang dan lembut.
            </Text>
            <ImagePicker
              label="Gambar Latar Belakang"
              value={formData.backgroundImage}
              onImageSelected={(value) => handleChange('backgroundImage', value)}
              placeholder="Pilih gambar latar belakang"
              maxSizeKB={300}
            />
            <Text style={styles.tipText}>
              Tip: Gunakan gambar dengan resolusi tinggi dan proporsi yang sesuai dengan layar ponsel (9:16).
              Gambar dengan nuansa pastel atau warna lembut akan memberikan kesan elegan.
            </Text>
          </>
        )}

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
  sectionTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginBottom: 16,
  },
  tipText: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    fontStyle: 'italic',
    color: colors.textLight,
    marginTop: 12,
    marginBottom: 24,
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
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.success,
    textAlign: 'center',
  },
  previewToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  previewToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  previewFrame: {
    width: '100%',
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewHeading: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
  },
  previewNames: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.secondary,
    marginBottom: 16,
  },
  previewDate: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
});