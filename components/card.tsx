import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
});
