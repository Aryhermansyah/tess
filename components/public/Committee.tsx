import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Platform, ScrollView } from 'react-native';
import { Card } from '@/components/shared/Card';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCommitteeStore } from '@/store/wedding-store';
import { Phone, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');
// Adjust columns for better mobile display: 2 columns on most mobile devices
const numColumns = width < 600 ? 2 : width < 768 ? 2 : width < 1024 ? 3 : 4;
const isSmallScreen = width < 768;
const isMobileScreen = width < 600;

// Reliable fallback image for committee members
const COMMITTEE_FALLBACK = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800';

export const Committee: React.FC = () => {
  // Use the committee store directly instead of the compatibility layer
  const committee = useWeddingCommitteeStore((state) => state.committee);

  // Add null check to prevent errors when data is undefined
  if (!committee || committee.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedView animation="fadeIn" style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <Users size={isMobileScreen ? 16 : isSmallScreen ? 18 : 24} color={colors.text} />
            <Text style={styles.sectionTitle}>Panitia</Text>
          </View>
          <Divider style={styles.divider} />
        </AnimatedView>
        <Text style={styles.loadingText}>Informasi panitia belum tersedia</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <AnimatedView 
      animation="fadeIn" 
      delay={100 * index}
      style={styles.memberCardContainer}
    >
      <Card style={styles.memberCard} variant="elevated">
        <ImageWithFallback
          source={item.photo || ""}
          style={styles.memberImage}
          fallbackImageUrl={COMMITTEE_FALLBACK}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.memberRole} numberOfLines={1} ellipsizeMode="tail">{item.role}</Text>
          <View style={styles.phoneContainer}>
            <Phone size={12} color={colors.primary} />
            <Text style={styles.memberPhone} numberOfLines={1} ellipsizeMode="tail">{item.phone}</Text>
          </View>
        </View>
      </Card>
    </AnimatedView>
  );

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Users size={isMobileScreen ? 16 : isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Panitia</Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.subtitle}>Tim yang membuat hari ini spesial</Text>
      </AnimatedView>

      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {committee.map((item, index) => (
          <AnimatedView 
            key={item.id}
            animation="fadeIn" 
            delay={100 * index}
            style={styles.memberCardContainer}
          >
            <Card style={styles.memberCard} variant="elevated">
              <ImageWithFallback
                source={item.photo || ""}
                style={styles.memberImage}
                fallbackImageUrl={COMMITTEE_FALLBACK}
              />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.memberRole} numberOfLines={1} ellipsizeMode="tail">{item.role}</Text>
                <View style={styles.phoneContainer}>
                  <Phone size={12} color={colors.primary} />
                  <Text style={styles.memberPhone} numberOfLines={1} ellipsizeMode="tail">{item.phone}</Text>
                </View>
              </View>
            </Card>
          </AnimatedView>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width < 600 ? 12 : isSmallScreen ? 16 : 20,
    marginBottom: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: width < 600 ? 12 : isSmallScreen ? 16 : 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: width < 600 ? 6 : isSmallScreen ? 8 : 12,
    paddingHorizontal: width < 600 ? 14 : isSmallScreen ? 16 : 24,
    borderRadius: 30,
    marginBottom: 6,
  },
  sectionTitle: {
    ...fonts.heading,
    fontSize: width < 600 ? fonts.sizes.lg : isSmallScreen ? fonts.sizes.xl : fonts.sizes.xxl,
    color: colors.text,
  },
  divider: {
    width: width < 600 ? 60 : isSmallScreen ? 80 : 100,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginBottom: 12,
  },
  loadingText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  subtitle: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 600,
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContentContainer: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  memberCardContainer: {
    marginRight: 12,
    width: width < 600 ? 160 : isSmallScreen ? 180 : 200,
  },
  memberCard: {
    padding: 0,
    overflow: 'hidden',
    height: '100%',
  },
  memberImage: {
    width: '100%',
    height: width < 600 ? 120 : isSmallScreen ? 135 : 150,
    aspectRatio: 4/3,
    objectFit: 'cover',
  },
  memberInfo: {
    padding: width < 600 ? 8 : 12,
  },
  memberName: {
    ...fonts.heading,
    fontSize: width < 600 ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.text,
  },
  memberRole: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  memberPhone: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.primary,
  },
});