import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined' | 'gold';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'default'
}) => {
  // For gold variant, add a gradient border
  if (variant === 'gold') {
    return (
      <View style={[styles.goldCardContainer, style]}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryLight, colors.secondary]}
          style={styles.goldBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.goldCardContent}>
            {children}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[
      styles.card, 
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  elevated: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  goldCardContainer: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  goldBorder: {
    padding: 2,
    borderRadius: 12,
  },
  goldCardContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
  },
});