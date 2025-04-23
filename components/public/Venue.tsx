import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { MapPin, Navigation, Map } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export const Venue: React.FC = () => {
  // Use the core store directly instead of the compatibility layer
  const venue = useWeddingCoreStore((state) => state.venue);
  const date = useWeddingCoreStore((state) => state.date);

  const handleOpenMap = () => {
    if (venue?.mapUrl) {
      Linking.openURL(venue.mapUrl).catch(err => {
        console.error("Couldn't open map URL", err);
      });
    }
  };

  // Format date for display
  const formatDisplayDate = () => {
    if (!date) return "Tanggal akan diumumkan";
    
    try {
      // Check if date is already in a readable format
      if (typeof date === 'string' && date.includes('-')) {
        return date;
      }
      
      const dateObj = new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid date format in Venue:", date);
        return "Tanggal akan diumumkan";
      }
      
      // Format date in a readable way
      return dateObj.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date in Venue:", error);
      return "Tanggal akan diumumkan";
    }
  };

  // Add null check to prevent errors when data is undefined
  if (!venue) {
    return (
      <View style={styles.container}>
        <AnimatedView animation="fadeIn" style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <Map size={isSmallScreen ? 18 : 24} color={colors.text} />
            <Text style={styles.sectionTitle}>Tempat & Lokasi</Text>
          </View>
          <Divider style={styles.divider} />
        </AnimatedView>
        <Text style={styles.loadingText}>Informasi lokasi belum tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Map size={isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Tempat & Lokasi</Text>
        </View>
        <Divider style={styles.divider} />
      </AnimatedView>

      <View style={[styles.contentContainer, isSmallScreen && styles.contentContainerSmall]}>
        <AnimatedView animation="slideLeft" delay={300} style={styles.infoContainer}>
          <Card style={styles.infoCard} variant="elevated">
            <Text style={styles.dateText}>{formatDisplayDate()}</Text>
            <Text style={styles.venueName}>{venue.name}</Text>
            
            <View style={styles.addressContainer}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.addressText}>{venue.address}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={handleOpenMap}
              disabled={!venue.mapUrl}
            >
              <Navigation size={18} color={colors.white} />
              <Text style={styles.directionsText}>Petunjuk Arah</Text>
            </TouchableOpacity>
            
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Mohon hadir 15 menit sebelum acara dimulai. Parkir tersedia di lokasi.
              </Text>
            </View>
          </Card>
        </AnimatedView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.primaryLight,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.xl : fonts.sizes.xxl,
    color: colors.text,
  },
  divider: {
    width: isSmallScreen ? 80 : 100,
    height: 2,
    backgroundColor: colors.primary,
  },
  loadingText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  contentContainerSmall: {
    flexDirection: 'column',
  },
  infoContainer: {
    flex: 1,
  },
  infoCard: {
    padding: 24,
    height: isSmallScreen ? 'auto' : '100%',
  },
  dateText: {
    ...fonts.heading,
    fontSize: fonts.sizes.lg,
    color: colors.primary,
    marginBottom: 8,
  },
  venueName: {
    ...fonts.heading,
    fontSize: fonts.sizes.xl,
    color: colors.text,
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  addressText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  directionsText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.white,
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: colors.secondaryLight,
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    fontStyle: 'italic',
  },
});