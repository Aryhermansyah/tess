import React, { useState, useEffect } from 'react';
import { Image, ImageStyle, StyleProp, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

interface ImageWithFallbackProps {
  source: string;
  style?: StyleProp<ImageStyle>;
  fallbackType?: 'person' | 'venue' | 'decoration' | 'logo' | 'generic';
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackImageUrl?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  source, 
  style, 
  fallbackType = 'generic',
  contentFit = 'cover',
  fallbackImageUrl
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSource, setCurrentSource] = useState<string | null>(source);

  // Fallback images for different types - using reliable Unsplash URLs
  const fallbackImages = {
    person: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
    venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000',
    decoration: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=1000',
    generic: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000',
  };

  // Reset states when source changes
  useEffect(() => {
    if (source !== currentSource) {
      setIsLoading(true);
      setHasError(false);
      setRetryCount(0);
      setCurrentSource(source);
    }
  }, [source]);

  // Handle image load error
  const handleError = () => {
    console.warn(`Image loading error: ${currentSource}`);
    
    // If we've already retried twice, give up and show fallback
    if (retryCount >= 2) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Try again with a small delay
    setRetryCount(prev => prev + 1);
    
    // For the first retry, try adding a cache-busting parameter
    if (retryCount === 0 && currentSource) {
      const cacheBuster = `?cache=${Date.now()}`;
      const newSource = currentSource.includes('?') 
        ? `${currentSource}&cache=${Date.now()}`
        : `${currentSource}${cacheBuster}`;
      
      console.log(`Retrying with cache buster: ${newSource}`);
      setCurrentSource(newSource);
      return;
    }
    
    // For the second retry, wait a bit longer
    setTimeout(() => {
      setIsLoading(true);
      // Force a re-render with the same source
      setCurrentSource(currentSource ? `${currentSource}` : null);
    }, 1000);
  };

  // Get the appropriate fallback image
  const getFallbackImage = () => {
    if (fallbackImageUrl) {
      return fallbackImageUrl;
    }
    return fallbackImages[fallbackType];
  };

  // If source is null, undefined, or empty string, show fallback
  if (!currentSource) {
    return (
      <Image 
        source={{ uri: getFallbackImage() }}
        style={style}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={[styles.loadingContainer, style]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      
      {hasError ? (
        <Image 
          source={{ uri: getFallbackImage() }}
          style={[style, { resizeMode: contentFit }]}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <Image
          source={{ uri: currentSource }}
          style={[style, { resizeMode: contentFit }]}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
});