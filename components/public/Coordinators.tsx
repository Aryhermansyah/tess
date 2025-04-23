import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Card } from '@/components/shared/Card';
import { AnimatedView } from '@/components/shared/AnimatedView';
import { Divider } from '@/components/shared/Divider';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { useWeddingCoordinatorsStore } from '@/store/wedding-store';
import { Phone, UserCog } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export const Coordinators: React.FC = () => {
  // Use the coordinators store directly instead of the compatibility layer
  const coordinators = useWeddingCoordinatorsStore((state) => state.coordinators);

  // Add null check to prevent errors when data is undefined
  if (!coordinators || coordinators.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedView animation="fadeIn" style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <UserCog size={isSmallScreen ? 18 : 24} color={colors.text} />
            <Text style={styles.sectionTitle}>Koordinator Acara</Text>
          </View>
          <Divider style={styles.divider} />
        </AnimatedView>
        <Text style={styles.loadingText}>Informasi koordinator belum tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedView animation="fadeIn" style={styles.headerContainer}>
        <View style={styles.titleWrapper}>
          <UserCog size={isSmallScreen ? 18 : 24} color={colors.text} />
          <Text style={styles.sectionTitle}>Koordinator Acara</Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.subtitle}>Tim yang bertanggung jawab untuk kelancaran acara pernikahan</Text>
      </AnimatedView>

      <Card style={styles.tableCard} variant="elevated">
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.roleCell]}>Jabatan</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Nama</Text>
          <Text style={[styles.headerCell, styles.phoneCell]}>No. HP</Text>
        </View>
        
        <ScrollView style={styles.tableBody}>
          {coordinators.map((coordinator, index) => (
            <AnimatedView 
              key={coordinator.id} 
              animation="fadeIn" 
              delay={50 * index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.cell, styles.roleCell]}>{coordinator.role}</Text>
              <Text style={[styles.cell, styles.nameCell]}>{coordinator.name}</Text>
              <View style={[styles.cell, styles.phoneCell, styles.phoneContainer]}>
                <Phone size={14} color={colors.primary} />
                <Text style={styles.phoneText}>{coordinator.phone}</Text>
              </View>
            </AnimatedView>
          ))}
        </ScrollView>
      </Card>
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
    marginTop: 8,
    marginBottom: 16,
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
    fontSize: isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 600,
  },
  tableCard: {
    padding: 0,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    ...fonts.heading,
    fontSize: fonts.sizes.md,
    color: colors.white,
    fontWeight: 'bold',
  },
  tableBody: {
    maxHeight: isSmallScreen ? 400 : 600,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  evenRow: {
    backgroundColor: colors.white,
  },
  oddRow: {
    backgroundColor: colors.primaryLight + '30',
  },
  cell: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.sm : fonts.sizes.md,
    color: colors.text,
  },
  roleCell: {
    flex: 2,
    fontWeight: '500',
  },
  nameCell: {
    flex: 2,
  },
  phoneCell: {
    flex: isSmallScreen ? 1.5 : 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    ...fonts.body,
    fontSize: isSmallScreen ? fonts.sizes.xs : fonts.sizes.sm,
    color: colors.textLight,
  },
});