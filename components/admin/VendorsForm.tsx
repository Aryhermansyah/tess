import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingVendorsStore } from '@/store/wedding-store';
import { Vendor } from '@/types';
import { uploadImageToSupabase } from '@/utils/supabaseUpload';
import { Plus, Trash2, Edit, List, ChevronDown, ChevronUp, Move } from 'lucide-react-native';

export const VendorsForm: React.FC = () => {
  const vendors = useWeddingVendorsStore((state) => state.vendors);
  const updateVendors = useWeddingVendorsStore((state) => state.updateVendors);
  
  const [vendorsList, setVendorsList] = useState<Vendor[]>(vendors);
  const [currentVendor, setCurrentVendor] = useState<Vendor>({
    id: '',
    name: '',
    category: '',
    contact: '',
    instagram: '',
    logo: '',
    details: [],
    description: '',
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // For details management
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [currentDetail, setCurrentDetail] = useState('');
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const handleChange = async (field: keyof Vendor, value: string) => {
    if (field === 'logo' && value && !value.startsWith('http')) {
      try {
        setLoading(true);
        const fileName = `vendor_${Date.now()}.jpg`;
        const url = await uploadImageToSupabase('wedding-images', value, fileName);
        if (url) {
          setCurrentVendor({
            ...currentVendor,
            [field]: url,
          });
        } else {
          Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
        }
      } catch (err) {
        console.error('Gagal upload gambar vendor:', err);
        Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
      } finally {
        setLoading(false);
      }
      return;
    }
    setCurrentVendor({
      ...currentVendor,
      [field]: value,
    });
  };

  const handleAddVendor = async () => {
    if (!currentVendor.name || !currentVendor.category) {
      alert('Silakan masukkan setidaknya nama dan kategori');
      return;
    }

    if (editing) {
      // Update existing vendor
      const updatedVendors = vendorsList.map(vendor => 
        vendor.id === editing ? { ...currentVendor, id: editing } : vendor
      );
      setVendorsList(updatedVendors);
      setEditing(null);
    } else {
      // Add new vendor
      const newVendor = {
        ...currentVendor,
        id: Date.now().toString(),
      };
      setVendorsList([...vendorsList, newVendor]);
    }

    // Reset form
    setCurrentVendor({
      id: '',
      name: '',
      category: '',
      contact: '',
      instagram: '',
      logo: '',
      details: [],
      description: '',
    });
    setShowDetailsForm(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simpan data ke Supabase
      const { error } = await supabase
        .from('admin_core')
        .upsert([{ vendors: vendorsList }], { onConflict: 'id' });
      if (error) {
        throw error;
      }
      updateVendors(vendorsList);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating vendors:', error);
      Alert.alert(
        'Gagal Menyimpan',
        'Terjadi kesalahan saat menyimpan data. Coba kurangi ukuran foto atau hapus beberapa data.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Details management
  const handleAddDetail = () => {
    if (!currentDetail.trim()) {
      alert('Silakan masukkan detail');
      return;
    }

    const updatedDetails = [...(currentVendor.details || []), currentDetail];
    setCurrentVendor({
      ...currentVendor,
      details: updatedDetails,
    });
    setCurrentDetail('');
  };

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = [...(currentVendor.details || [])];
    updatedDetails.splice(index, 1);
    setCurrentVendor({
      ...currentVendor,
      details: updatedDetails,
    });
  };

  const handleMoveDetail = (index: number, direction: 'up' | 'down') => {
    if (!currentVendor.details) return;
    
    const updatedDetails = [...currentVendor.details];
    
    if (direction === 'up' && index > 0) {
      // Swap with the previous item
      [updatedDetails[index], updatedDetails[index - 1]] = 
      [updatedDetails[index - 1], updatedDetails[index]];
    } else if (direction === 'down' && index < updatedDetails.length - 1) {
      // Swap with the next item
      [updatedDetails[index], updatedDetails[index + 1]] = 
      [updatedDetails[index + 1], updatedDetails[index]];
    }
    
    setCurrentVendor({
      ...currentVendor,
      details: updatedDetails,
    });
  };

  const toggleVendorExpand = (id: string) => {
    setExpandedVendor(expandedVendor === id ? null : id);
  };

  // Helper function for batch adding details
  const handleBatchAddDetails = () => {
    try {
      // Try to parse the current detail as multiple lines
      const lines = currentDetail.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length > 0) {
        const updatedDetails = [...(currentVendor.details || []), ...lines];
        setCurrentVendor({
          ...currentVendor,
          details: updatedDetails,
        });
        setCurrentDetail('');
      } else {
        alert('Silakan masukkan setidaknya satu detail');
      }
    } catch (error) {
      console.error('Error adding batch details:', error);
      alert('Terjadi kesalahan saat menambahkan detail');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Vendor Pernikahan</Text>
        <Text style={styles.subtitle}>Kelola vendor dan layanan pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Vendor berhasil diperbarui!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Vendor' : 'Tambah Vendor Baru'}
        </Text>
        
        <Input
          label="Nama Vendor"
          value={currentVendor.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Nama perusahaan"
        />
        <Input
          label="Kategori"
          value={currentVendor.category}
          onChangeText={(value) => handleChange('category', value)}
          placeholder="Kategori layanan"
        />

        <Input
          label="Deskripsi Singkat"
          value={currentVendor.description || ''}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Contoh: FOTO & VIDEO by PEH POTRET"
          multiline={false}
        />

        <Input
          label="Kontak"
          value={currentVendor.contact}
          onChangeText={(value) => handleChange('contact', value)}
          placeholder="Nomor telepon"
          keyboardType="phone-pad"
        />
        <Input
          label="Instagram"
          value={currentVendor.instagram}
          onChangeText={(value) => handleChange('instagram', value)}
          placeholder="Akun Instagram"
        />
        <ImagePicker
          label="Logo Vendor"
          value={currentVendor.logo}
          onImageSelected={(value) => handleChange('logo', value)}
          placeholder="Pilih logo vendor"
          maxSizeKB={100} // Reduced size limit
        />

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Detail Layanan</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowDetailsForm(!showDetailsForm)}
            >
              <Text style={styles.toggleButtonText}>
                {showDetailsForm ? 'Sembunyikan Form Detail' : 'Tampilkan Form Detail'}
              </Text>
              {showDetailsForm ? 
                <ChevronUp size={16} color={colors.primary} /> : 
                <ChevronDown size={16} color={colors.primary} />
              }
            </TouchableOpacity>
          </View>

          {showDetailsForm && (
            <View style={styles.detailsForm}>
              <Text style={styles.detailsInputLabel}>Detail Layanan</Text>
              <Text style={styles.detailsInputHelper}>
                Masukkan satu detail per baris untuk menambahkan beberapa sekaligus
              </Text>
              <TextInput
                value={currentDetail}
                onChangeText={setCurrentDetail}
                placeholder="Tambahkan detail layanan atau paket. Contoh:&#10;Max 9 Hours Service (One day)&#10;Wedding Book 20x30 (20 Pages)&#10;All File Copy (Flashdisk)"
                multiline
                numberOfLines={8}
                style={styles.multilineInput}
              />
              
              <View style={styles.detailsButtonsRow}>
                <Button
                  title="Tambah Satu"
                  onPress={handleAddDetail}
                  icon={<Plus size={18} color={colors.white} />}
                  style={[styles.addDetailButton, styles.halfButton]}
                />
                
                <Button
                  title="Tambah Semua"
                  onPress={handleBatchAddDetails}
                  icon={<Plus size={18} color={colors.white} />}
                  style={[styles.addDetailButton, styles.halfButton]}
                />
              </View>
              
              {currentVendor.details && currentVendor.details.length > 0 && (
                <View style={styles.currentDetailsList}>
                  <Text style={styles.currentDetailsTitle}>Detail Saat Ini:</Text>
                  
                  {currentVendor.details.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                      <View style={styles.detailItemContent}>
                        <Text style={styles.detailNumber}>{index + 1}.</Text>
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                      <View style={styles.detailItemActions}>
                        <TouchableOpacity
                          style={[styles.detailActionButton, index === 0 && styles.disabledButton]}
                          onPress={() => handleMoveDetail(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp size={18} color={index === 0 ? colors.textLight : colors.primary} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.detailActionButton, index === currentVendor.details!.length - 1 && styles.disabledButton]}
                          onPress={() => handleMoveDetail(index, 'down')}
                          disabled={index === currentVendor.details!.length - 1}
                        >
                          <ChevronDown size={18} color={index === currentVendor.details!.length - 1 ? colors.textLight : colors.primary} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.detailActionButton}
                          onPress={() => handleDeleteDetail(index)}
                        >
                          <Trash2 size={18} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Button
            title={editing ? 'Update Vendor' : 'Tambah Vendor'}
            onPress={handleAddVendor}
            style={styles.addButton}
          />
          {editing && (
            <Button
              title="Batal"
              onPress={() => {
                setEditing(null);
                setCurrentVendor({
                  id: '',
                  name: '',
                  category: '',
                  contact: '',
                  instagram: '',
                  logo: '',
                  details: [],
                  description: '',
                });
                setShowDetailsForm(false);
              }}
              style={styles.cancelButton}
              type="secondary"
            />
          )}
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Daftar Vendor</Text>
        
        {vendorsList.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada vendor. Tambahkan vendor pertama Anda.</Text>
        ) : (
          vendorsList.map((vendor) => (
            <View key={vendor.id} style={styles.vendorCard}>
              <View style={styles.vendorHeader}>
                <ImageWithFallback
                  source={vendor.logo || ''}
                  style={styles.vendorLogo}
                  fallbackImageUrl="https://via.placeholder.com/100"
                />
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorCategory}>{vendor.category}</Text>
                  {vendor.description && (
                    <Text style={styles.vendorDescription}>{vendor.description}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.vendorActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditVendor(vendor)}
                >
                  <Edit size={16} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => toggleVendorExpand(vendor.id)}
                >
                  <List size={16} color={colors.primary} />
                  <Text style={styles.actionButtonText}>
                    {expandedVendor === vendor.id ? 'Sembunyikan Detail' : 'Lihat Detail'}
                  </Text>
                  {expandedVendor === vendor.id ? 
                    <ChevronUp size={16} color={colors.primary} /> : 
                    <ChevronDown size={16} color={colors.primary} />
                  }
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteVendor(vendor.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                  <Text style={[styles.actionButtonText, styles.deleteText]}>Hapus</Text>
                </TouchableOpacity>
              </View>
              
              {expandedVendor === vendor.id && vendor.details && vendor.details.length > 0 && (
                <View style={styles.vendorDetailsContainer}>
                  {vendor.details.map((detail, index) => (
                    <View key={index} style={styles.vendorDetailItem}>
                      <Text style={styles.vendorDetailNumber}>{index + 1}.</Text>
                      <Text style={styles.vendorDetailText}>{detail}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}

        <Button
          title="Simpan Perubahan"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
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
    padding: 16,
  },
  title: {
    ...fonts.heading,
    fontSize: fonts.sizes.xl,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
  },
  successContainer: {
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    ...fonts.body,
    color: colors.success,
    fontSize: fonts.sizes.md,
    textAlign: 'center',
  },
  sectionTitle: {
    ...fonts.heading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  emptyText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  vendorCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vendorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vendorLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    ...fonts.heading,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 4,
  },
  vendorCategory: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    marginBottom: 2,
  },
  vendorDescription: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  vendorActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  actionButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    marginLeft: 4,
  },
  deleteText: {
    color: colors.error,
  },
  vendorDetailsContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vendorDetailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vendorDetailNumber: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    width: 24,
    fontWeight: 'bold',
  },
  vendorDetailText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    flex: 1,
  },
  detailsSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsTitle: {
    ...fonts.heading,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  toggleButtonText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    marginRight: 4,
  },
  detailsForm: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsInputLabel: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsInputHelper: {
    ...fonts.body,
    fontSize: fonts.sizes.xs,
    color: colors.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  addDetailButton: {
    marginTop: 8,
  },
  detailsButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 0.48,
  },
  currentDetailsList: {
    marginTop: 16,
  },
  currentDetailsTitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailItemContent: {
    flexDirection: 'row',
    flex: 1,
  },
  detailNumber: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    width: 24,
  },
  detailText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    flex: 1,
  },
  detailItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailActionButton: {
    padding: 4,
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButton: {
    marginTop: 16,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});