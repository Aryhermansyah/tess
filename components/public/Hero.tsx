import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { ChevronDown } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
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

export const Hero: React.FC = () => {
  const { couple, date, theme } = useWeddingCoreStore();

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

  const handleScrollDown = () => {
    // Perbaikan untuk scrolling - gunakan document.getElementById untuk menemukan elemen selanjutnya
    if (typeof document !== 'undefined') {
      // Cari elemen pertama setelah hero, umumnya Schedule atau Overview
      const nextSection = document.querySelector('.section-after-hero, #schedule, #overview');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback jika tidak ada selector khusus
        window.scrollBy({
          top: height * 0.9,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: theme.backgroundImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <AnimatedView animation="fadeIn" delay={300} style={styles.headerText}>
              <Text style={styles.welcomeText}>Ananta Planner</Text>
            </AnimatedView>
            
            <AnimatedView animation="fadeIn" delay={600} style={styles.coupleContainer}>
              <Text style={styles.coupleText}>{couple.groom.name}</Text>
              <Text style={styles.ampersand}>&</Text>
              <Text style={styles.coupleText}>{couple.bride.name}</Text>
            </AnimatedView>
            
            <AnimatedView animation="fadeIn" delay={900} style={styles.dateContainer}>
              <View style={styles.dateLine} />
              <Text style={styles.dateText}>{formattedDate}</Text>
              <View style={styles.dateLine} />
            </AnimatedView>
            
            <AnimatedView animation="fadeIn" delay={1200} style={styles.messageContainer}>
              <Text style={styles.messageText}>
                roundwon detail acara
              </Text>
            </AnimatedView>
            
            <TouchableOpacity 
              style={styles.scrollButton} 
              onPress={handleScrollDown} 
              activeOpacity={0.7}
            >
              <View style={styles.chevronStack}>
                <ChevronDown size={24} color={colors.white} style={styles.chevronTop} />
                <ChevronDown size={24} color={colors.secondary} style={styles.chevronMiddle} />
                <ChevronDown size={24} color="rgba(255,255,255,0.3)" style={styles.chevronBottom} />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.9,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
  },
  headerText: {
    marginBottom: 20,
  },
  welcomeText: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.xl : fonts.sizes.xxl,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  coupleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  coupleText: {
    fontFamily: 'Dream Avenue',
    fontSize: isSmallScreen ? fonts.sizes.xxxl : 48,
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  ampersand: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.xxl : 36,
    color: colors.secondary,
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    justifyContent: 'center',
  },
  dateLine: {
    height: 1,
    width: isSmallScreen ? 40 : 60,
    backgroundColor: colors.secondary,
    marginHorizontal: 15,
  },
  dateText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.md : fonts.sizes.lg,
    color: colors.white,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    maxWidth: isSmallScreen ? '100%' : '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  messageText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chevronStack: {
    height: 40,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronTop: {
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  chevronMiddle: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
  },
  chevronBottom: {
    position: 'absolute',
    top: 16,
    zIndex: 1,
  },
});