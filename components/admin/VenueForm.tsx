import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { Venue } from '@/types';
import { MapPin, Link, Map } from 'lucide-react-native';

export const VenueForm: React.FC = () => {
  const venue = useWeddingCoreStore((state) => state.venue);
  const updateVenue = useWeddingCoreStore((state) => state.updateVenue);
  
  const [formData, setFormData] = useState<Venue>(venue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mapPreview, setMapPreview] = useState<string | null>(venue.mapPreviewUrl || null);

  const handleChange = (field: keyof Venue, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // If the mapUrl field is being updated, generate a preview
    if (field === 'mapUrl') {
      generateMapPreview(value);
    }
  };

  // Generate a map preview URL from the Google Maps URL
  const generateMapPreview = (url: string) => {
    if (!url) {
      setMapPreview(null);
      return;
    }

    try {
      // Extract location information from Google Maps URL
      let previewUrl = '';
      
      // For Google Maps URLs, we can use a static map service
      if (url.includes('google.com/maps')) {
        // Extract location from URL if possible
        
        // For URLs like: https://www.google.com/maps?q=-7.978845119476318,111.99181365966797&z=17&hl=id
        if (url.includes('maps?q=')) {
          const queryPart = url.split('maps?q=')[1];
          if (queryPart) {
            const coordinates = queryPart.split('&')[0];
            if (coordinates.includes(',')) {
              const [lat, lng] = coordinates.split(',');
              previewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}`;
            }
          }
        }
        // For URLs like: https://maps.google.com/?q=Hotel+Mulia+Jakarta
        else if (url.includes('?q=')) {
          const query = url.split('?q=')[1].split('&')[0];
          // Use Google Maps static map
          previewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${query}`;
        } 
        // For URLs with @lat,lng format
        else if (url.includes('@')) {
          const coords = url.split('@')[1].split(',');
          if (coords.length >= 2) {
            const lat = coords[0];
            const lng = coords[1].split(',')[0];
            previewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}`;
          }
        }
      }
      
      // If we couldn't generate a preview URL, use a default map image
      if (!previewUrl) {
        previewUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=1&size=600x300&maptype=roadmap';
      }
      
      setMapPreview(previewUrl);
      
      // Update the form data with the preview URL
      setFormData(prev => ({
        ...prev,
        mapPreviewUrl: previewUrl
      }));
    } catch (error) {
      console.error('Error generating map preview:', error);
      setMapPreview(null);
    }
  };

  // Generate preview on initial load
  useEffect(() => {
    if (venue.mapUrl) {
      generateMapPreview(venue.mapUrl);
    }
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        updateVenue(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating venue:', error);
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kesalahan saat menyimpan data. Coba kurangi ukuran foto atau hapus beberapa data.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Informasi Tempat</Text>
        <Text style={styles.subtitle}>Perbarui detail tempat pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Informasi tempat berhasil diperbarui!</Text>
          </View>
        )}

        <Input
          label="Nama Tempat"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Nama tempat"
          leftIcon={<MapPin size={20} color={colors.textLight} />}
        />
        
        <Input
          label="Alamat"
          value={formData.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Alamat lengkap tempat"
          multiline
          numberOfLines={3}
        />
        
        <Input
          label="URL Google Maps"
          value={formData.mapUrl}
          onChangeText={(value) => handleChange('mapUrl', value)}
          placeholder="Link ke lokasi Google Maps"
          leftIcon={<Link size={20} color={colors.textLight} />}
        />

        {mapPreview && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview Peta:</Text>
            <View style={styles.mapPreviewWrapper}>
              <Image 
                source={{ uri: mapPreview }} 
                style={styles.mapPreview}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                <Map size={24} color={colors.white} />
              </View>
            </View>
            <Text style={styles.previewNote}>
              Preview ini akan ditampilkan di halaman utama
            </Text>
          </View>
        )}

        <ImagePicker
          label="Foto Tempat (Opsional)"
          value={formData.venuePhoto || ''}
          onImageSelected={(value) => handleChange('venuePhoto', value)}
          placeholder="Pilih foto tempat"
          maxSizeKB={300} // Limit image size
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
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 16,
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
  previewContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  previewLabel: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  mapPreviewWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreview: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  previewNote: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
});