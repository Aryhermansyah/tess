import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { Heart, Calendar, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

// Month name mapping
const MONTH_NAMES: Record<string, string> = {
  JAN: 'Januari',
  FEB: 'Februari',
  MAR: 'Maret',
  APR: 'April',
  MAY: 'Mei',
  JUN: 'Juni',
  JUL: 'Juli',
  AUG: 'Agustus',
  SEP: 'September',
  OCT: 'Oktober',
  NOV: 'November',
  DEC: 'Desember',
  // Indonesian month names
  JANUARI: 'Januari',
  FEBRUARI: 'Februari',
  MARET: 'Maret',
  APRIL: 'April',
  MEI: 'Mei',
  JUNI: 'Juni',
  JULI: 'Juli',
  AGUSTUS: 'Agustus',
  SEPTEMBER: 'September',
  OKTOBER: 'Oktober',
  NOVEMBER: 'November',
  DESEMBER: 'Desember'
};

export const Footer: React.FC = () => {
  const { couple, date, venue } = useWeddingCoreStore();

  // Format the date properly
  const formatDate = (dateString: string) => {
    // Check if the date is already in the format we want (e.g., "20 Oktober 2024")
    if (dateString.includes(' ') && dateString.split(' ').length >= 3) {
      const parts = dateString.split(' ');
      // If the month is already in Indonesian, return as is
      if (Object.values(MONTH_NAMES).includes(parts[1])) {
        return dateString;
      }
      
      // If the month is in uppercase English abbreviation, translate it
      const monthUpper = parts[1].toUpperCase();
      if (MONTH_NAMES[monthUpper]) {
        return `${parts[0]} ${MONTH_NAMES[monthUpper]} ${parts[2]}`;
      }
    }
    
    // Try to parse as a date object if it's in a different format
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate();
        const month = MONTH_NAMES[date.toLocaleString('en-US', { month: 'short' }).toUpperCase()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    // Return the original string if we couldn't parse it
    return dateString;
  };

  const formattedDate = formatDate(date);

  const openMap = () => {
    if (venue.mapUrl) {
      Linking.openURL(venue.mapUrl);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primary + '80']}
        style={styles.gradient}
      >
        <AnimatedView animation="fadeIn" style={styles.content}>
          <View style={styles.coupleContainer}>
            <Text style={styles.coupleText}>{couple.groom.name} & {couple.bride.name}</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Calendar size={20} color={colors.secondary} />
              <Text style={styles.infoText}>{formattedDate}</Text>
            </View>
            
            <TouchableOpacity style={styles.infoItem} onPress={openMap}>
              <MapPin size={20} color={colors.secondary} />
              <Text style={styles.infoText}>{venue.name}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.thanksContainer}>
            <Text style={styles.thanksText}>
              Terima kasih atas doa dan restu yang diberikan
            </Text>
            <View style={styles.heartContainer}>
              <Heart size={16} color={colors.secondary} fill={colors.secondary} />
            </View>
          </View>
          
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Wedding Invitation App
          </Text>
        </AnimatedView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gradient: {
    padding: isSmallScreen ? 24 : 40,
  },
  content: {
    alignItems: 'center',
  },
  coupleContainer: {
    marginBottom: 20,
  },
  coupleText: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.xl : fonts.sizes.xxl,
    color: colors.white,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  infoText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.md : fonts.sizes.lg,
    color: colors.white,
  },
  divider: {
    width: isSmallScreen ? 100 : 150,
    height: 1,
    backgroundColor: colors.secondary,
    marginBottom: 20,
  },
  thanksContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  thanksText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  heartContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyrightText: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.white + '80',
    textAlign: 'center',
  },
});