import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingMoodboardStore } from '@/store/wedding-store';
import { MoodboardItem, MoodboardCategory } from '@/types';
import { Plus, Trash2, Edit, Palette, ChevronDown, ChevronUp } from 'lucide-react-native';

export const MoodboardForm: React.FC = () => {
  const moodboard = useWeddingMoodboardStore((state) => state.moodboard);
  const updateMoodboard = useWeddingMoodboardStore((state) => state.updateMoodboard);
  
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>(moodboard);
  const [currentItem, setCurrentItem] = useState<MoodboardItem>({
    id: '',
    title: '',
    category: 'decoration',
    imageUrl: '',
    description: '',
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories: {id: MoodboardCategory | 'all', label: string}[] = [
    { id: 'decoration', label: 'Dekorasi' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'attire', label: 'Busana' },
    { id: 'flowers', label: 'Bunga' },
    { id: 'cake', label: 'Kue' },
    { id: 'invitation', label: 'Undangan' },
    { id: 'other', label: 'Lainnya' },
  ];

  const handleChange = (field: keyof MoodboardItem, value: string) => {
    setCurrentItem({
      ...currentItem,
      [field]: value,
    });
  };

  const handleSelectCategory = (category: MoodboardCategory) => {
    setCurrentItem({
      ...currentItem,
      category,
    });
    setShowCategoryDropdown(false);
  };

  const handleAddItem = () => {
    if (!currentItem.title || !currentItem.imageUrl) {
      Alert.alert('Error', 'Silakan masukkan setidaknya judul dan gambar');
      return;
    }

    if (editing) {
      // Update existing item
      const updatedItems = moodboardItems.map(item => 
        item.id === editing ? { ...currentItem, id: editing } : item
      );
      setMoodboardItems(updatedItems);
      setEditing(null);
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        id: Date.now().toString(),
      };
      setMoodboardItems([...moodboardItems, newItem]);
    }

    // Reset form
    setCurrentItem({
      id: '',
      title: '',
      category: 'decoration',
      imageUrl: '',
      description: '',
    });
  };

  const handleEditItem = (item: MoodboardItem) => {
    setCurrentItem(item);
    setEditing(item.id);
    setExpandedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus item ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            setMoodboardItems(moodboardItems.filter(item => item.id !== id));
            if (editing === id) {
              setEditing(null);
              setCurrentItem({
                id: '',
                title: '',
                category: 'decoration',
                imageUrl: '',
                description: '',
              });
            }
            if (expandedItem === id) {
              setExpandedItem(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleItemExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        updateMoodboard(moodboardItems);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating moodboard:', error);
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kesalahan saat menyimpan data. Coba kurangi ukuran foto atau hapus beberapa item.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Handle image selection with proper typing
  const handleImageSelected = (value: string) => {
    handleChange('imageUrl', value);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Moodboard Pernikahan</Text>
        <Text style={styles.subtitle}>Kelola inspirasi visual untuk pernikahan Anda</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Moodboard berhasil diperbarui!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Item Moodboard' : 'Tambah Item Moodboard Baru'}
        </Text>
        
        <Input
          label="Judul"
          value={currentItem.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Judul item moodboard"
        />
        
        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Kategori</Text>
          <TouchableOpacity 
            style={styles.categorySelector}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Palette size={20} color={colors.textLight} />
            <Text style={styles.categoryText}>
              {categories.find(c => c.id === currentItem.category)?.label || 'Pilih Kategori'}
            </Text>
            {showCategoryDropdown ? 
              <ChevronUp size={20} color={colors.textLight} /> : 
              <ChevronDown size={20} color={colors.textLight} />
            }
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdownContainer}>
              {categories.filter(c => c.id !== 'all').map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.dropdownItem,
                    currentItem.category === category.id && styles.dropdownItemActive
                  ]}
                  onPress={() => handleSelectCategory(category.id as MoodboardCategory)}
                >
                  <Text 
                    style={[
                      styles.dropdownText,
                      currentItem.category === category.id && styles.dropdownTextActive
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <ImagePicker
          label="Gambar Moodboard"
          value={currentItem.imageUrl}
          onImageSelected={handleImageSelected}
          placeholder="Pilih gambar dari galeri"
          maxSizeKB={250} // Limit image size
        />
        
        <Input
          label="Deskripsi (Opsional)"
          value={currentItem.description || ''}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Deskripsi singkat tentang item ini"
          multiline
          numberOfLines={3}
        />

        <Button
          title={editing ? 'Perbarui Item' : 'Tambah Item'}
          onPress={handleAddItem}
          icon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />

        {editing && (
          <Button
            title="Batal Edit"
            onPress={() => {
              setEditing(null);
              setCurrentItem({
                id: '',
                title: '',
                category: 'decoration',
                imageUrl: '',
                description: '',
              });
            }}
            variant="outline"
            style={styles.cancelButton}
          />
        )}

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Daftar Item Moodboard ({moodboardItems.length})</Text>
        
        {moodboardItems.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada item moodboard yang ditambahkan</Text>
        ) : (
          moodboardItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemImageContainer}>
                  <ImageWithFallback
                    source={item.imageUrl}
                    style={styles.itemThumbnail}
                    fallbackType="decoration"
                  />
                </View>
                
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>
                    {categories.find(c => c.id === item.category)?.label || 'Lainnya'}
                  </Text>
                </View>
                
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.actionIconButton}
                    onPress={() => toggleItemExpand(item.id)}
                  >
                    {expandedItem === item.id ? 
                      <ChevronUp size={20} color={colors.primary} /> : 
                      <ChevronDown size={20} color={colors.primary} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              
              {expandedItem === item.id && (
                <View style={styles.expandedContent}>
                  <Divider style={styles.expandedDivider} />
                  
                  {item.description && (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  )}
                  
                  <View style={styles.expandedActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditItem(item)}
                    >
                      <Edit size={18} color={colors.primary} />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 size={18} color={colors.error} />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}

        <Button
          title="Simpan Semua Perubahan"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxl,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  divider: {
    marginVertical: 24,
  },
  addButton: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
  },
  // Category selector
  categoryContainer: {
    marginBottom: 16,
  },
  label: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginBottom: 6,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    flex: 1,
  },
  dropdownContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },
  dropdownText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  dropdownTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Item card
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
  },
  itemThumbnail: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemCategory: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    marginTop: 4,
  },
  itemActions: {
    padding: 8,
  },
  actionIconButton: {
    padding: 4,
  },
  expandedContent: {
    padding: 12,
    backgroundColor: colors.primaryLight + '30',
  },
  expandedDivider: {
    marginBottom: 12,
  },
  itemDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  actionButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
  },
  deleteButtonText: {
    color: colors.error,
  },
  emptyText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  successContainer: {
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.success,
    textAlign: 'center',
  },
});