import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface InterestChipProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  style?: ViewStyle;
}

export const InterestChip: React.FC<InterestChipProps> = ({ label, icon, selected, style }) => {
  return (
    <View style={[
      styles.chip, 
      selected ? styles.selectedChip : styles.unselectedChip,
      style
    ]}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={14} 
          color={selected ? COLORS.white : COLORS.primary} 
          style={styles.icon} 
        />
      )}
      <Text style={[
        styles.text,
        selected ? styles.selectedText : styles.unselectedText
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  unselectedChip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    ...TYPOGRAPHY.small,
    fontWeight: '500',
  },
  unselectedText: {
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.white,
  },
});
