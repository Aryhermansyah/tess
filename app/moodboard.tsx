import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useWeddingMoodboardStore } from '@/store/wedding-store';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { MoodboardItem, MoodboardCategory } from '@/types';
import { Palette, ChevronLeft, ChevronRight, Search, X } from 'lucide-react-native';
import { Input } from '@/components/shared/Input';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;
const numColumns = isSmallScreen ? 1 : 2;

export default function MoodboardScreen() {
  const moodboard = useWeddingMoodboardStore((state) => state.moodboard);
  const [selectedCategory, setSelectedCategory] = useState<MoodboardCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<MoodboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MoodboardItem | null>(null);

  const categories: {id: MoodboardCategory | 'all', label: string}[] = [
    { id: 'all', label: 'Semua' },
    { id: 'decoration', label: 'Dekorasi' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'attire', label: 'Busana' },
    { id: 'flowers', label: 'Bunga' },
    { id: 'cake', label: 'Kue' },
    { id: 'invitation', label: 'Undangan' },
    { id: 'other', label: 'Lainnya' },
  ];

  useEffect(() => {
    filterItems();
  }, [moodboard, selectedCategory, searchQuery]);

  const filterItems = () => {
    if (!moodboard) {
      setFilteredItems([]);
      return;
    }

    let filtered = [...moodboard];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  };

  const getCategoryLabel = (categoryId: MoodboardCategory | 'all') => {
    return categories.find(c => c.id === categoryId)?.label || 'Lainnya';
  };

  const renderItem = ({ item }: { item: MoodboardItem }) => (
    <AnimatedView animation="fadeIn" style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemTouchable}
        onPress={() => setSelectedItem(item)}
        activeOpacity={0.8}
      >
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
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </AnimatedView>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Moodboard Pernikahan',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            ...fonts.heading,
            fontSize: fonts.sizes.lg,
          },
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari inspirasi..."
            style={styles.searchInput}
            containerStyle={styles.searchInputWrapper}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Palette 
              size={16} 
              color={selectedCategory === category.id ? colors.white : colors.primary} 
            />
            <Text 
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? 'Tidak ada item yang cocok dengan pencarian Anda.' 
              : selectedCategory !== 'all' 
                ? `Belum ada item dalam kategori ${getCategoryLabel(selectedCategory)}.` 
                : 'Belum ada item moodboard yang ditambahkan.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setSelectedItem(null)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedItem(null)}
            >
              <X size={24} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.modalImageContainer}>
              <ImageWithFallback
                source={selectedItem.imageUrl}
                style={styles.modalImage}
                fallbackType="decoration"
              />
            </View>
            
            <View style={styles.modalInfo}>
              <View style={styles.modalCategoryBadge}>
                <Text style={styles.modalCategoryText}>
                  {getCategoryLabel(selectedItem.category)}
                </Text>
              </View>
              
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              
              {selectedItem.description && (
                <Text style={styles.modalDescription}>
                  {selectedItem.description}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    paddingLeft: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 4,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
  categoryButtonTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  itemContainer: {
    flex: 1/numColumns,
    padding: 8,
  },
  itemTouchable: {
    flex: 1,
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
    height: 180,
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
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 4,
  },
  itemDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: isSmallScreen ? '90%' : '70%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  modalImageContainer: {
    width: '100%',
    height: 300,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalInfo: {
    padding: 16,
  },
  modalCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalCategoryText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.white,
    fontWeight: 'bold',
  },
  modalTitle: {
    ...fonts.heading,
    fontSize: fonts.sizes.xl,
    color: colors.text,
    marginBottom: 12,
  },
  modalDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
});