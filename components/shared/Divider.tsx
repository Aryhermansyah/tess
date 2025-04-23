import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  thickness?: number;
  orientation?: 'horizontal' | 'vertical';
  length?: number | string;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = colors.border,
  thickness = 1,
  orientation = 'horizontal',
  length,
}) => {
  const dividerStyle = {
    backgroundColor: color,
    ...(orientation === 'horizontal'
      ? {
          height: thickness,
          width: length || '100%',
        }
      : {
          width: thickness,
          height: length || '100%',
        }),
  };

  return <View style={[dividerStyle, style]} />;
};