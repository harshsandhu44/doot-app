import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={COLORS.border} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.heading,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
