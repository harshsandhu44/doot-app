import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface BadgeProps {
  count?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ count, style, textStyle, dot }) => {
  if (count === 0 && !dot) return null;

  return (
    <View style={[styles.badge, dot ? styles.dot : null, style]}>
      {!dot && count !== undefined && (
        <Text style={[styles.text, textStyle]}>
          {count > 99 ? '99+' : count}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.error,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dot: {
    minWidth: 8,
    height: 8,
    borderRadius: 4,
    paddingHorizontal: 0,
  },
  text: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});
