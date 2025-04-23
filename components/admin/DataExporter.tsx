import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { exportAllData, importAllData, saveToStaticFile } from '@/utils/dataManager';
import { Download, Upload, Save } from 'lucide-react-native';

export const DataExporter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setMessage('Mengekspor data...');
    try {
      const jsonData = await exportAllData();
      
      // Untuk platform web, kita bisa menawarkan download file
      if (typeof window !== 'undefined') {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setSuccess(true);
      setMessage('Data berhasil diekspor!');
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengekspor data.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    // Untuk platform web, kita bisa menggunakan input file
    if (typeof window !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = async (e) => {
        if (input.files && input.files.length > 0) {
          setLoading(true);
          setMessage('Mengimpor data...');
          
          try {
            const file = input.files[0];
            const reader = new FileReader();
            
            reader.onload = async (event) => {
              if (event.target && typeof event.target.result === 'string') {
                const jsonData = event.target.result;
                const success = await importAllData(jsonData);
                
                if (success) {
                  setSuccess(true);
                  setMessage('Data berhasil diimpor!');
                  setTimeout(() => {
                    setSuccess(false);
                    setMessage('');
                  }, 3000);
                } else {
                  Alert.alert('Gagal', 'Terjadi kesalahan saat mengimpor data.');
                  setMessage('');
                }
              }
              setLoading(false);
            };
            
            reader.readAsText(file);
          } catch (error) {
            console.error('Error importing data:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat mengimpor data.');
            setMessage('');
            setLoading(false);
          }
        }
      };
      input.click();
    }
  };

  const handleSaveToStatic = async () => {
    setLoading(true);
    setMessage('Menyimpan data...');
    try {
      const success = await saveToStaticFile();
      
      if (success) {
        setSuccess(true);
        setMessage('Data berhasil disimpan untuk GitHub!');
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
        }, 3000);
      } else {
        Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
        setMessage('');
      }
    } catch (error) {
      console.error('Error saving to static file:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Ekspor & Impor Data</Text>
      <Text style={styles.subtitle}>Kelola data pernikahan untuk GitHub</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      ) : success ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button
          title="Ekspor Data"
          onPress={handleExport}
          icon={<Download size={18} color={colors.white} />}
          style={styles.button}
        />
        
        <Button
          title="Impor Data"
          onPress={handleImport}
          icon={<Upload size={18} color={colors.white} />}
          style={styles.button}
        />
        
        <Button
          title="Simpan untuk GitHub"
          onPress={handleSaveToStatic}
          icon={<Save size={18} color={colors.white} />}
          style={styles.button}
          variant="secondary"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Gunakan fitur ini untuk menyimpan data pernikahan Anda agar dapat diupload ke GitHub.
          Data yang disimpan termasuk semua informasi pernikahan dan referensi gambar.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontFamily: fonts.heading.fontFamily,
    fontWeight: fonts.heading.fontWeight as "bold",
    fontSize: fonts.sizes.xl,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    color: colors.textLight,
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginTop: 8,
  },
  successContainer: {
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.md,
    color: colors.success,
  },
  infoContainer: {
    backgroundColor: colors.primaryLight + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontFamily: fonts.body.fontFamily,
    fontWeight: fonts.body.fontWeight as "normal",
    fontSize: fonts.sizes.sm,
    color: colors.text,
  },
});

export default DataExporter;
