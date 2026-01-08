import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, style }) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep ? styles.filled : styles.unfilled,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    gap: 4,
    paddingHorizontal: SPACING.md,
  },
  segment: {
    flex: 1,
    borderRadius: BORDER_RADIUS.full,
  },
  filled: {
    backgroundColor: COLORS.primary,
  },
  unfilled: {
    backgroundColor: COLORS.border,
  },
});
