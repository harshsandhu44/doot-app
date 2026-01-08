import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  Animated,
  View
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon
}) => {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!loading && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getVariantStyle(),
          disabled && styles.disabled,
          style
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? COLORS.white : COLORS.primary} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, getVariantTextStyle(), textStyle]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  ghostText: {
    color: COLORS.text,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
});
