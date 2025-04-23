import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoreStore, useWeddingEventSummaryStore } from '@/store/wedding-store';
import { EventSummary } from '@/types';
import { Calendar, Clock, Users, Gift, Save } from 'lucide-react-native';

export const EventSummaryForm: React.FC = () => {
  const weddingDate = useWeddingCoreStore((state) => state.date);
  const eventSummary = useWeddingEventSummaryStore((state) => state.eventSummary);
  const updateEventSummary = useWeddingEventSummaryStore((state) => state.updateEventSummary);
  
  const [formData, setFormData] = useState<EventSummary>(
    eventSummary || {
      place: '',
      eventType: '',
      ceremonyTime: '',
      receptionTime: '',
      ceremonyGuests: '',
      ceremonyGuestsDetail: '',
      receptionGuests: '',
      churchStaffSouvenir: '',
      churchStaffNote: '',
      receptionSouvenir: '',
      receptionSouvenirNote: ''
    }
  );
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof EventSummary, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.place || !formData.eventType) {
      Alert.alert('Error', 'Silakan isi setidaknya tempat dan jenis acara');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        // Use the wedding date from the core store
        updateEventSummary(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error updating event summary:', error);
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kesalahan saat menyimpan data.',
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
        <Text style={styles.title}>Ringkasan Acara</Text>
        <Text style={styles.subtitle}>Kelola informasi ringkasan acara pernikahan</Text>

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Ringkasan acara berhasil diperbarui!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Calendar size={18} color={colors.text} style={styles.sectionIcon} />
            Informasi Umum
          </Text>
          
          <Text style={styles.dateInfo}>
            Tanggal Acara: <Text style={styles.dateValue}>{weddingDate}</Text>
          </Text>
          <Text style={styles.dateNote}>
            Catatan: Tanggal acara diambil dari pengaturan utama. Untuk mengubah tanggal, silakan perbarui di halaman pengaturan tema.
          </Text>
          
          <Input
            label="Tempat"
            value={formData.place}
            onChangeText={(value) => handleChange('place', value)}
            placeholder="Contoh: Griya Joglo"
          />
          
          <Input
            label="Jenis Acara"
            value={formData.eventType}
            onChangeText={(value) => handleChange('eventType', value)}
            placeholder="Contoh: Pemberkatan & Resepsi"
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Clock size={18} color={colors.text} style={styles.sectionIcon} />
            Waktu Acara
          </Text>
          
          <Input
            label="Waktu Pemberkatan"
            value={formData.ceremonyTime}
            onChangeText={(value) => handleChange('ceremonyTime', value)}
            placeholder="Contoh: 14.00 – 15.30"
          />
          
          <Input
            label="Waktu Resepsi"
            value={formData.receptionTime}
            onChangeText={(value) => handleChange('receptionTime', value)}
            placeholder="Contoh: 15.30 – 18.00"
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Users size={18} color={colors.text} style={styles.sectionIcon} />
            Informasi Tamu
          </Text>
          
          <Input
            label="Jumlah Tamu Pemberkatan"
            value={formData.ceremonyGuests}
            onChangeText={(value) => handleChange('ceremonyGuests', value)}
            placeholder="Contoh: 100 Orang"
          />
          
          <Input
            label="Detail Tamu Pemberkatan"
            value={formData.ceremonyGuestsDetail}
            onChangeText={(value) => handleChange('ceremonyGuestsDetail', value)}
            placeholder="Contoh: (Keluarga Inti & Jemaat)"
          />
          
          <Input
            label="Jumlah Tamu Resepsi"
            value={formData.receptionGuests}
            onChangeText={(value) => handleChange('receptionGuests', value)}
            placeholder="Contoh: 350 Orang"
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Gift size={18} color={colors.text} style={styles.sectionIcon} />
            Souvenir
          </Text>
          
          <Input
            label="Souvenir Petugas Gereja"
            value={formData.churchStaffSouvenir}
            onChangeText={(value) => handleChange('churchStaffSouvenir', value)}
            placeholder="Contoh: 5 pcs (Nasi Kotak by Keluarga + Souvenir)"
          />
          
          <Input
            label="Catatan Souvenir Petugas Gereja"
            value={formData.churchStaffNote}
            onChangeText={(value) => handleChange('churchStaffNote', value)}
            placeholder="Contoh: *ada tambahan bingkisan sendiri"
          />
          
          <Input
            label="Souvenir Tamu Resepsi"
            value={formData.receptionSouvenir}
            onChangeText={(value) => handleChange('receptionSouvenir', value)}
            placeholder="Contoh: 300 pcs (Gelas Tumbler)"
          />
          
          <Input
            label="Catatan Souvenir Tamu Resepsi"
            value={formData.receptionSouvenirNote}
            onChangeText={(value) => handleChange('receptionSouvenirNote', value)}
            placeholder="Contoh: Kenang-kenangan spesial untuk para tamu yang hadir"
            multiline
            numberOfLines={3}
          />
        </View>

        <Button
          title="Simpan Ringkasan Acara"
          onPress={handleSubmit}
          loading={loading}
          icon={<Save size={18} color={colors.white} />}
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...fonts.subheading,
    fontSize: fonts.sizes.lg,
    color: colors.text,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  divider: {
    marginVertical: 16,
  },
  saveButton: {
    marginTop: 24,
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
  dateInfo: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 8,
  },
  dateValue: {
    fontWeight: 'bold',
  },
  dateNote: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.textLight,
    fontStyle: 'italic',
    marginBottom: 16,
  },
});