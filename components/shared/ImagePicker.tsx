import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { Camera } from 'lucide-react-native';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  maxSizeKB?: number;
  category?: string;
}

/**
 * A component that allows users to pick an image from their device and saves it locally
 */
export const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  value,
  label = "Image",
  placeholder = "Select Image",
  maxSizeKB = 500,
  category = 'misc'
}) => {
  const [image, setImage] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);

  // Effect to update image when value changes
  useEffect(() => {
    if (value !== image) {
      setImage(value || null);
    }
  }, [value]);

  const pickImage = async () => {
    // Request permission
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      // Launch image picker with minimal options
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3, // Low quality to reduce size
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Update UI immediately
        setLoading(true);
        setImage(selectedImage.uri);
        
        // Store in localStorage for web
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(`wedding_image_${category}`, selectedImage.uri);
        }
        
        // Call the callback with the new image URI
        onImageSelected(selectedImage.uri);
        console.log(`Image selected: ${selectedImage.uri.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Saving image...</Text>
        </View>
      ) : image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
          <Camera size={24} color={colors.text} />
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    marginBottom: 8,
    color: colors.text,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeButtonText: {
    color: 'white',
    fontSize: fonts.sizes.sm,
  },
  placeholder: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  placeholderText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginTop: 8,
  },
  loadingContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  loadingText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginTop: 8,
  },
});