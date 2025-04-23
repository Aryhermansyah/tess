import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore, useWeddingEventSummaryStore } from '@/store/wedding-store';
import { Calendar, Clock, Users, Gift } from 'lucide-react-native';

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

export const EventSummary: React.FC = () => {
  const eventSummary = useWeddingEventSummaryStore((state) => state.eventSummary);
  const weddingDate = useWeddingCoreStore((state) => state.date);
  
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

  // If no event summary data is available, don't render anything
  if (!eventSummary) {
    return null;
  }

  // Use the formatted date from the wedding core store
  const formattedDate = formatDate(weddingDate);

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Calendar size={isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Ringkasan Acara</Text>
        </View>
        <Divider style={styles.divider} />
      </AnimatedView>

      <Card style={styles.card} variant="elevated">
        <AnimatedView animation="fadeIn" delay={200}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Tanggal</Text>
              <Text style={styles.summaryValue}>{formattedDate}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconContainer}>
              <Clock size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Waktu</Text>
              <View style={styles.timeContainer}>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Pemberkatan:</Text>
                  <Text style={styles.timeValue}>{eventSummary.ceremonyTime}</Text>
                </View>
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Resepsi:</Text>
                  <Text style={styles.timeValue}>{eventSummary.receptionTime}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconContainer}>
              <Users size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Tamu</Text>
              <View style={styles.guestsContainer}>
                <View style={styles.guestItem}>
                  <Text style={styles.guestLabel}>Pemberkatan:</Text>
                  <Text style={styles.guestValue}>{eventSummary.ceremonyGuests}</Text>
                  <Text style={styles.guestDetail}>{eventSummary.ceremonyGuestsDetail}</Text>
                </View>
                <View style={styles.guestItem}>
                  <Text style={styles.guestLabel}>Resepsi:</Text>
                  <Text style={styles.guestValue}>{eventSummary.receptionGuests}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryIconContainer}>
              <Gift size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Souvenir</Text>
              <View style={styles.souvenirContainer}>
                <View style={styles.souvenirItem}>
                  <Text style={styles.souvenirLabel}>Petugas Gereja:</Text>
                  <Text style={styles.souvenirValue}>{eventSummary.churchStaffSouvenir}</Text>
                  {eventSummary.churchStaffNote && (
                    <Text style={styles.souvenirNote}>{eventSummary.churchStaffNote}</Text>
                  )}
                </View>
                <View style={styles.souvenirItem}>
                  <Text style={styles.souvenirLabel}>Tamu Resepsi:</Text>
                  <Text style={styles.souvenirValue}>{eventSummary.receptionSouvenir}</Text>
                  {eventSummary.receptionSouvenirNote && (
                    <Text style={styles.souvenirNote}>{eventSummary.receptionSouvenirNote}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </AnimatedView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isSmallScreen ? 16 : 20,
    backgroundColor: colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    borderRadius: 30,
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
  card: {
    padding: isSmallScreen ? 16 : 20,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    ...fonts.subheading,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 8,
  },
  summaryValue: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  timeContainer: {
    gap: 8,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    width: 100,
  },
  timeValue: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    fontWeight: '500',
  },
  guestsContainer: {
    gap: 8,
  },
  guestItem: {
    marginBottom: 4,
  },
  guestLabel: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
  },
  guestValue: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  guestDetail: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  souvenirContainer: {
    gap: 12,
  },
  souvenirItem: {
    marginBottom: 4,
  },
  souvenirLabel: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
  },
  souvenirValue: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  souvenirNote: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
});