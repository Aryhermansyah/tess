import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Card } from '@/components/shared/Card';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore } from '@/store/wedding-store';
import { Heart, Home, Users, Instagram, Phone, User, UserRound, Users2, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

// Reliable fallback images
const FALLBACK_IMAGES = {
  groom: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800',
  bride: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=800',
};

export const CoupleInfo: React.FC = () => {
  const [biodataExpanded, setBiodataExpanded] = useState(false);
  const couple = useWeddingCoreStore((state) => state.couple);

  // Add null checks to prevent errors when data is undefined
  if (!couple || !couple.groom || !couple.bride) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading couple information...</Text>
      </View>
    );
  }

  const toggleBiodata = () => {
    setBiodataExpanded(!biodataExpanded);
  };

  // Animated styles for chevron rotation
  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          rotate: withTiming(biodataExpanded ? '180deg' : '0deg', {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }) 
        }
      ],
    };
  });

  // Animated styles for biodata container
  const biodataContainerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: biodataExpanded 
        ? withTiming(1000, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }) 
        : withTiming(0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      opacity: biodataExpanded 
        ? withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }) 
        : withTiming(0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      overflow: 'hidden',
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.sectionTitle}>Pasangan Pengantin</Text>
        </View>
        <Divider style={styles.divider} />
      </AnimatedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Photos Container */}
        <View style={styles.photosContainer}>
          {/* Groom Photo */}
          <AnimatedView animation="fadeIn" delay={300} style={styles.photoColumn}>
            <View style={styles.photoWrapper}>
              <ImageWithFallback
                source={couple.groom.photo || ""}
                style={styles.personImage}
                fallbackImageUrl={FALLBACK_IMAGES.groom}
                fallbackType="person"
              />
              <Text style={styles.photoName}>{couple.groom.nickname}</Text>
              <Text style={styles.fullName}>{couple.groom.fullName}</Text>
            </View>
          </AnimatedView>

          {/* Bride Photo */}
          <AnimatedView animation="fadeIn" delay={300} style={styles.photoColumn}>
            <View style={styles.photoWrapper}>
              <ImageWithFallback
                source={couple.bride.photo || ""}
                style={styles.personImage}
                fallbackImageUrl={FALLBACK_IMAGES.bride}
                fallbackType="person"
              />
              <Text style={styles.photoName}>{couple.bride.nickname}</Text>
              <Text style={styles.fullName}>{couple.bride.fullName}</Text>
            </View>
          </AnimatedView>
        </View>

        {/* Biodata Dropdown Button */}
        <AnimatedView animation="fadeIn" delay={600} style={styles.biodataButtonContainer}>
          <TouchableOpacity 
            style={styles.biodataButton} 
            onPress={toggleBiodata}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primaryLight, colors.secondaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.biodataButtonGradient}
            />
            <Text style={styles.biodataButtonText}>Biodata Pengantin</Text>
            <Animated.View style={chevronStyle}>
              <ChevronDown size={20} color={colors.text} />
            </Animated.View>
          </TouchableOpacity>
        </AnimatedView>

        {/* Biodata Dropdown Content */}
        <Animated.View style={[styles.biodataContainer, biodataContainerStyle]}>
          <Card style={styles.biodataCard} variant="elevated">
            <LinearGradient
              colors={['rgba(255,248,240,0.9)', 'rgba(255,248,240,0.7)']}
              style={styles.cardGradient}
            />
            
            <View style={styles.biodataContent}>
              {/* Groom Biodata */}
              <View style={styles.personBiodata}>
                <Text style={styles.bioTitle}>Biodata Mempelai Pria</Text>
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <User size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Nama:</Text>
                    <Text style={styles.detailText}>{couple.groom.nickname}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <UserRound size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Ayah:</Text>
                    <Text style={styles.detailText}>{couple.groom.fatherName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <UserRound size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Ibu:</Text>
                    <Text style={styles.detailText}>{couple.groom.motherName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users2 size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Anak:</Text>
                    <Text style={styles.detailText}>{couple.groom.siblingPosition}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Home size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Alamat:</Text>
                    <Text style={styles.detailText}>{couple.groom.address}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Phone size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Telepon:</Text>
                    <Text style={styles.detailText}>{couple.groom.phone}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Instagram size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>IG:</Text>
                    <Text style={styles.detailText}>{couple.groom.instagram}</Text>
                  </View>
                </View>
              </View>

              <Divider style={styles.biodataDivider} />

              {/* Bride Biodata */}
              <View style={styles.personBiodata}>
                <Text style={styles.bioTitle}>Biodata Mempelai Wanita</Text>
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <User size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Nama:</Text>
                    <Text style={styles.detailText}>{couple.bride.nickname}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <UserRound size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Ayah:</Text>
                    <Text style={styles.detailText}>{couple.bride.fatherName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <UserRound size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Ibu:</Text>
                    <Text style={styles.detailText}>{couple.bride.motherName}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users2 size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Anak:</Text>
                    <Text style={styles.detailText}>{couple.bride.siblingPosition}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Home size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Alamat:</Text>
                    <Text style={styles.detailText}>{couple.bride.address}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Phone size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>Telepon:</Text>
                    <Text style={styles.detailText}>{couple.bride.phone}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Instagram size={14} color={colors.primary} />
                    <Text style={styles.detailLabel}>IG:</Text>
                    <Text style={styles.detailText}>{couple.bride.instagram}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isSmallScreen ? 12 : 20,
    backgroundColor: colors.background,
  },
  loadingText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    paddingVertical: isSmallScreen ? 6 : 12,
    paddingHorizontal: isSmallScreen ? 14 : 24,
    borderRadius: 30,
    marginBottom: 8,
  },
  sectionTitle: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.lg : fonts.sizes.xxl,
    color: colors.text,
  },
  divider: {
    width: isSmallScreen ? 80 : 100,
    height: 2,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  photoColumn: {
    width: isSmallScreen ? '48%' : '45%',
  },
  photoWrapper: {
    alignItems: 'center',
  },
  personImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  photoName: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.md : fonts.sizes.lg,
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  fullName: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  biodataButtonContainer: {
    marginBottom: isSmallScreen ? 8 : 16,
  },
  biodataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallScreen ? 10 : 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    overflow: 'hidden',
  },
  biodataButtonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  biodataButtonText: {
    ...fonts.heading,
    fontSize: isSmallScreen ? fonts.sizes.md : fonts.sizes.lg,
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  biodataContainer: {
    marginBottom: isSmallScreen ? 16 : 24,
  },
  biodataCard: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  biodataContent: {
    padding: isSmallScreen ? 12 : 20,
  },
  personBiodata: {
    marginBottom: isSmallScreen ? 16 : 24,
  },
  bioTitle: {
    ...fonts.subheading,
    fontSize: isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.text,
    marginBottom: isSmallScreen ? 8 : 12,
    textAlign: 'center',
    backgroundColor: colors.primary + '30',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    gap: isSmallScreen ? 6 : 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 4 : 8,
  },
  detailLabel: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.text,
    fontWeight: 'bold',
    width: isSmallScreen ? 50 : 80,
    marginLeft: 4,
  },
  detailText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.text,
    flex: 1,
  },
  biodataDivider: {
    height: 1,
    backgroundColor: colors.secondary + '50',
    marginVertical: isSmallScreen ? 12 : 20,
  },
});