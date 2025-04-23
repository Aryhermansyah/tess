import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useWeddingMoodboardStore } from '@/store/wedding-store';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { MoodboardItem } from '@/types';
import { Palette, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;
const PREVIEW_LIMIT = 4;

export const MoodboardPreview: React.FC = () => {
  const moodboard = useWeddingMoodboardStore((state) => state.moodboard);
  const [previewItems, setPreviewItems] = useState<MoodboardItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (moodboard && moodboard.length > 0) {
      // Get a random selection of items for preview
      const shuffled = [...moodboard].sort(() => 0.5 - Math.random());
      setPreviewItems(shuffled.slice(0, PREVIEW_LIMIT));
    }
  }, [moodboard]);

  const handleViewAll = () => {
    router.push('/moodboard');
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'decoration': 'Dekorasi',
      'makeup': 'Makeup',
      'attire': 'Busana',
      'flowers': 'Bunga',
      'cake': 'Kue',
      'invitation': 'Undangan',
      'other': 'Lainnya',
    };
    return categories[category] || 'Lainnya';
  };

  const renderItem = ({ item }: { item: MoodboardItem }) => (
    <AnimatedView animation="fadeIn" style={styles.itemContainer}>
      <Card style={styles.itemCard}>
        <View style={styles.imageContainer}>
          <ImageWithFallback
            source={item.imageUrl}
            style={styles.itemImage}
            fallbackType="decoration"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        </View>
      </Card>
    </AnimatedView>
  );

  if (!moodboard || moodboard.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <Palette size={isSmallScreen ? 18 : 24} color={colors.primary} />
          <Text style={styles.sectionTitle}>Moodboard Pernikahan</Text>
        </View>
        <Divider style={styles.divider} />
      </View>

      <Text style={styles.description}>
        Inspirasi visual untuk pernikahan impian Anda
      </Text>

      <FlatList
        data={previewItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
        <Text style={styles.viewAllText}>Lihat Semua Inspirasi</Text>
        <ArrowRight size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isSmallScreen ? 16 : 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
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
  description: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    gap: 12,
  },
  itemContainer: {
    flex: 1,
    margin: 6,
  },
  itemCard: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary + 'CC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryText: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.white,
    fontWeight: 'bold',
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: 'center',
    gap: 8,
  },
  viewAllText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.white,
    fontWeight: 'bold',
  },
});