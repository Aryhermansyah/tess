import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { ImagePicker } from '@/components/shared/ImagePicker';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCommitteeStore } from '@/store/wedding-store';
import { CommitteeMember } from '@/types';
import { uploadImageToSupabase } from '@/utils/supabaseUpload';
import { Plus, Trash2, Edit } from 'lucide-react-native';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

export const CommitteeForm: React.FC = () => {
  const committee = useWeddingCommitteeStore((state) => state.committee);
  const updateCommittee = useWeddingCommitteeStore((state) => state.updateCommittee);
  
  const [members, setMembers] = useState<CommitteeMember[]>(committee);
  const [currentMember, setCurrentMember] = useState<CommitteeMember>({
    id: '',
    name: '',
    role: '',
    phone: '',
    photo: '',
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMemberChange = async (field: keyof CommitteeMember, value: string) => {
    if (field === 'photo' && value && !value.startsWith('http')) {
      try {
        setLoading(true);
        const fileName = `committee_${Date.now()}.jpg`;
        const url = await uploadImageToSupabase('wedding-images', value, fileName);
        if (url) {
          setCurrentMember({
            ...currentMember,
            [field]: url,
          });
        } else {
          Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
        }
      } catch (err) {
        console.error('Gagal upload gambar committee:', err);
        Alert.alert('Upload Gagal', 'Gagal upload gambar ke Supabase');
      } finally {
        setLoading(false);
      }
      return;
    }
    setCurrentMember({
      ...currentMember,
      [field]: value,
    });
  };

  const handleAddMember = () => {
    if (!currentMember.name || !currentMember.role) {
      alert('Silakan masukkan setidaknya nama dan peran');
      return;
    }

    if (editing) {
      // Update existing member
      const updatedMembers = members.map(member => 
        member.id === editing ? { ...currentMember, id: editing } : member
      );
      setMembers(updatedMembers);
      setEditing(null);
    } else {
      // Add new member
      const newMember = {
        ...currentMember,
        id: Date.now().toString(),
      };
      setMembers([...members, newMember]);
    }

    // Reset form
    setCurrentMember({
      id: '',
      name: '',
      role: '',
      phone: '',
      photo: '',
    });
  };

  const handleEditMember = (member: CommitteeMember) => {
    setCurrentMember(member);
    setEditing(member.id);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    if (editing === id) {
      setEditing(null);
      setCurrentMember({
        id: '',
        name: '',
        role: '',
        phone: '',
        photo: '',
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simpan data ke Supabase
      const { error } = await supabase
        .from('admin_core')
        .upsert([{ committee: members }], { onConflict: 'id' });
      if (error) {
        throw error;
      }
      updateCommittee(members);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating committee:', error);
      Alert.alert(
        'Gagal Menyimpan',
        'Terjadi kesalahan saat menyimpan data. Coba kurangi ukuran foto atau hapus beberapa data.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Panitia Pernikahan</Text>
        <Text style={styles.subtitle}>Kelola anggota panitia pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Panitia berhasil diperbarui!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Anggota' : 'Tambah Anggota Baru'}
        </Text>
        
        <Input
          label="Nama"
          value={currentMember.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Nama anggota"
        />
        <Input
          label="Peran"
          value={currentMember.role}
          onChangeText={(value) => handleChange('role', value)}
          placeholder="Peran anggota"
        />
        <Input
          label="Telepon"
          value={currentMember.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Nomor kontak"
          keyboardType="phone-pad"
        />
        <ImagePicker
          label="Foto Anggota"
          value={currentMember.photo}
          onImageSelected={(value) => handleChange('photo', value)}
          placeholder="Pilih foto anggota"
          maxSizeKB={150} // Reduced size limit
        />

        <Button
          title={editing ? 'Perbarui Anggota' : 'Tambah Anggota'}
          onPress={handleAddMember}
          icon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />

        {editing && (
          <Button
            title="Batal Edit"
            onPress={() => {
              setEditing(null);
              setCurrentMember({
                id: '',
                name: '',
                role: '',
                phone: '',
                photo: '',
              });
            }}
            variant="outline"
            style={styles.cancelButton}
          />
        )}

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Anggota Panitia ({members.length})</Text>
        
        {members.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada anggota panitia yang ditambahkan</Text>
        ) : (
          members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              {member.photo && (
                <View style={styles.memberPhotoContainer}>
                  <ImageWithFallback
                    source={member.photo}
                    style={styles.memberPhoto}
                  />
                </View>
              )}
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberPhone}>{member.phone}</Text>
              </View>
              <View style={styles.memberActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditMember(member)}
                >
                  <Edit size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteMember(member.id)}
                >
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
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
  },
  subtitle: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 24,
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
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 12,
  },
  memberPhotoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
    marginRight: 12,
  },
  memberPhoto: {
    width: '100%',
    height: '100%',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  memberRole: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginTop: 2,
  },
  memberPhone: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
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