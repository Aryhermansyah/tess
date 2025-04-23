import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoordinatorsStore } from '@/store/wedding-store';
import { Coordinator } from '@/types';
import { Plus, Trash2, Edit } from 'lucide-react-native';

export const CoordinatorsForm: React.FC = () => {
  const coordinators = useWeddingCoordinatorsStore((state) => state.coordinators);
  const updateCoordinators = useWeddingCoordinatorsStore((state) => state.updateCoordinators);
  
  const [coordinatorsList, setCoordinatorsList] = useState<Coordinator[]>(coordinators);
  const [currentCoordinator, setCurrentCoordinator] = useState<Coordinator>({
    id: '',
    role: '',
    name: '',
    phone: '',
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof Coordinator, value: string) => {
    setCurrentCoordinator({
      ...currentCoordinator,
      [field]: value,
    });
  };

  const handleAddCoordinator = () => {
    if (!currentCoordinator.name || !currentCoordinator.role) {
      alert('Silakan masukkan setidaknya nama dan peran');
      return;
    }

    if (editing) {
      // Update existing coordinator
      const updatedCoordinators = coordinatorsList.map(coordinator => 
        coordinator.id === editing ? { ...currentCoordinator, id: editing } : coordinator
      );
      setCoordinatorsList(updatedCoordinators);
      setEditing(null);
    } else {
      // Add new coordinator
      const newCoordinator = {
        ...currentCoordinator,
        id: Date.now().toString(),
      };
      setCoordinatorsList([...coordinatorsList, newCoordinator]);
    }

    // Reset form
    setCurrentCoordinator({
      id: '',
      role: '',
      name: '',
      phone: '',
    });
  };

  const handleEditCoordinator = (coordinator: Coordinator) => {
    setCurrentCoordinator(coordinator);
    setEditing(coordinator.id);
  };

  const handleDeleteCoordinator = (id: string) => {
    setCoordinatorsList(coordinatorsList.filter(coordinator => coordinator.id !== id));
    if (editing === id) {
      setEditing(null);
      setCurrentCoordinator({
        id: '',
        role: '',
        name: '',
        phone: '',
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        updateCoordinators(coordinatorsList);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating coordinators:', error);
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kesalahan saat menyimpan data. Coba hapus beberapa data yang tidak diperlukan.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Koordinator Acara</Text>
        <Text style={styles.subtitle}>Kelola koordinator dan petugas acara pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Koordinator berhasil diperbarui!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Koordinator' : 'Tambah Koordinator Baru'}
        </Text>
        
        <Input
          label="Peran"
          value={currentCoordinator.role}
          onChangeText={(value) => handleChange('role', value)}
          placeholder="Peran dalam acara"
        />
        <Input
          label="Nama"
          value={currentCoordinator.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Nama koordinator"
        />
        <Input
          label="Telepon"
          value={currentCoordinator.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Nomor kontak"
          keyboardType="phone-pad"
        />

        <Button
          title={editing ? 'Perbarui Koordinator' : 'Tambah Koordinator'}
          onPress={handleAddCoordinator}
          icon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />

        {editing && (
          <Button
            title="Batal Edit"
            onPress={() => {
              setEditing(null);
              setCurrentCoordinator({
                id: '',
                role: '',
                name: '',
                phone: '',
              });
            }}
            variant="outline"
            style={styles.cancelButton}
          />
        )}

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Daftar Koordinator ({coordinatorsList.length})</Text>
        
        {coordinatorsList.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada koordinator yang ditambahkan</Text>
        ) : (
          coordinatorsList.map((coordinator) => (
            <View key={coordinator.id} style={styles.coordinatorCard}>
              <View style={styles.coordinatorInfo}>
                <Text style={styles.coordinatorRole}>{coordinator.role}</Text>
                <Text style={styles.coordinatorName}>{coordinator.name}</Text>
                <Text style={styles.coordinatorPhone}>{coordinator.phone}</Text>
              </View>
              <View style={styles.coordinatorActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditCoordinator(coordinator)}
                >
                  <Edit size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteCoordinator(coordinator.id)}
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
  coordinatorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginBottom: 12,
  },
  coordinatorInfo: {
    flex: 1,
  },
  coordinatorRole: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: 'bold',
  },
  coordinatorName: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginTop: 2,
  },
  coordinatorPhone: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  coordinatorActions: {
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