import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Card } from '@/components/shared/Card';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingVendorsStore } from '@/store/wedding-store';
import { Phone, Instagram, ChevronDown, ChevronUp, List, Store } from 'lucide-react-native';

const { width } = Dimensions.get('window');
// Adjust columns for better mobile display: 2 columns on most mobile devices
const numColumns = width < 600 ? 2 : width < 768 ? 2 : width < 1024 ? 3 : 4;
const isSmallScreen = width < 768;
const isMobileScreen = width < 600;

// Reliable fallback image for vendor logos
const VENDOR_LOGO_FALLBACK = 'https://images.unsplash.com/photo-1563694983011-6f4d90358083?q=80&w=800';

export const Vendors: React.FC = () => {
  const vendors = useWeddingVendorsStore((state) => state.vendors);
  const { width: windowWidth } = useWindowDimensions();
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const toggleVendor = (id: string) => {
    setExpandedVendor(expandedVendor === id ? null : id);
  };
  
  // Responsive column count based on screen width
  const getColumnCount = () => {
    if (windowWidth < 600) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };
  
  const columnCount = getColumnCount();

  // Add null check to prevent errors when data is undefined
  if (!vendors || vendors.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedView animation="fadeIn" style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <Store size={isMobileScreen ? 16 : isSmallScreen ? 18 : 24} color={colors.text} />
            <Text style={styles.sectionTitle}>Vendor</Text>
          </View>
          <Divider style={styles.divider} />
        </AnimatedView>
        <Text style={styles.loadingText}>Informasi vendor belum tersedia</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isExpanded = expandedVendor === item.id;
    
    return (
      <AnimatedView 
        animation="fadeIn" 
        delay={100 * index}
        style={[
          styles.vendorCardContainer,
          { width: `${100 / columnCount}%` },
          width < 600 && { paddingHorizontal: 8, paddingBottom: 16 }
        ]}
      >
        <Card style={styles.vendorCard} variant="elevated">
          <ImageWithFallback
            source={item.logo || ""}
            style={[
              styles.vendorLogo,
              {
                height: width < 600 ? 120 : width < 768 ? 160 : 180
              }
            ]}
            contentFit="cover"
            fallbackImageUrl={VENDOR_LOGO_FALLBACK}
          />
          <View style={styles.vendorInfo}>
            <Text style={[
              styles.vendorName,
              width < 600 && { fontSize: fonts.sizes.md, marginTop: 8 }
            ]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.vendorCategory} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
            
            {item.description && (
              <Text style={styles.vendorDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
            )}
            
            <View style={styles.contactContainer}>
              <View style={styles.contactRow}>
                <Phone size={isMobileScreen ? 12 : 14} color={colors.primary} />
                <Text style={[
                  styles.contactText,
                  width < 600 && { marginTop: 4 }
                ]} numberOfLines={1} ellipsizeMode="tail">{item.contact}</Text>
              </View>
              
              <View style={styles.contactRow}>
                <Instagram size={isMobileScreen ? 12 : 14} color={colors.primary} />
                <Text style={[
                  styles.contactText,
                  width < 600 && { marginTop: 4 }
                ]} numberOfLines={1} ellipsizeMode="tail">{item.instagram}</Text>
              </View>
            </View>

            {item.details && item.details.length > 0 && (
              <View style={styles.detailsContainer}>
                <TouchableOpacity 
                  style={styles.detailsToggle}
                  onPress={() => toggleVendor(item.id)}
                >
                  <Text style={styles.detailsToggleText}>
                    {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
                  </Text>
                  {isExpanded ? 
                    <ChevronUp size={16} color={colors.primary} /> :
                    <ChevronDown size={16} color={colors.primary} />
                  }
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.detailsList}>
                    <Divider style={styles.detailsDivider} />
                    {item.details.map((detail: string, idx: number) => (
                      <View key={idx} style={styles.detailItem}>
                        <Text style={styles.detailBullet}>•</Text>
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </Card>
      </AnimatedView>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Store size={isMobileScreen ? 16 : isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Vendor</Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.subtitle}>Tim profesional pendukung acara</Text>
      </AnimatedView>

      <View style={[styles.gridContainer, { flexDirection: 'row', flexWrap: 'wrap' }]}>
        <FlatList
          data={vendors}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns} // Force re-render when columns change
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width < 600 ? 12 : isSmallScreen ? 16 : 20,
    backgroundColor: colors.white,
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
  gridContainer: {
    width: '100%',
  },
  listContainer: {
    paddingBottom: 12,
    alignItems: 'stretch',
  },
  vendorCardContainer: {
    flex: 1,
    padding: width < 600 ? 4 : 8,
    minWidth: 150,
  },
  vendorCard: {
    padding: 0,
    overflow: 'hidden',
    height: '100%',
  },
  vendorLogo: {
    width: '100%',
    borderRadius: 8,
  },
  vendorInfo: {
    padding: width < 600 ? 8 : 16,
  },
  vendorName: {
    ...fonts.heading,
    fontSize: width < 600 ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.text,
  },
  vendorCategory: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.primary,
    marginTop: 2,
  },
  vendorDescription: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 8,
    marginBottom: 8,
    lineHeight: width < 600 ? 16 : 20,
  },
  contactContainer: {
    marginTop: 6,
    gap: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : isSmallScreen ? fonts.sizes.sm : fonts.sizes.xs,
    color: colors.textLight,
  },
  detailsContainer: {
    marginTop: 12,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderRadius: 4,
    backgroundColor: colors.backgroundLight,
  },
  detailsToggleText: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  detailsList: {
    marginTop: 8,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  detailBullet: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.primary,
    marginRight: 6,
  },
  detailText: {
    ...fonts.body,
    fontSize: width < 600 ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.text,
    flex: 1,
    lineHeight: width < 600 ? 18 : 22,
  },
});