import { TextStyle } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#2D3436',
  textSecondary: '#636E72',
  border: '#DFE6E9',
  error: '#FF7675',
  success: '#00B894',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F7F7F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const TYPOGRAPHY: Record<string, TextStyle> = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
};

// React Native Paper Theme Integration
export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    onPrimary: COLORS.white,
    secondary: COLORS.secondary,
    onSecondary: COLORS.white,
    background: COLORS.background,
    onBackground: COLORS.text,
    surface: COLORS.surface,
    onSurface: COLORS.text,
    surfaceVariant: COLORS.gray[100],
    onSurfaceVariant: COLORS.textSecondary,
    error: COLORS.error,
    onError: COLORS.white,
    outline: COLORS.border,
    outlineVariant: COLORS.gray[300],
    elevation: {
      level0: 'transparent',
      level1: COLORS.white,
      level2: COLORS.surface,
      level3: COLORS.surface,
      level4: COLORS.surface,
      level5: COLORS.surface,
    },
  },
};

export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    onPrimary: COLORS.white,
    secondary: COLORS.secondary,
    onSecondary: COLORS.white,
    background: COLORS.black,
    onBackground: COLORS.white,
    surface: COLORS.gray[900],
    onSurface: COLORS.white,
    surfaceVariant: COLORS.gray[800],
    onSurfaceVariant: COLORS.gray[400],
    error: COLORS.error,
    onError: COLORS.white,
    outline: COLORS.gray[700],
    outlineVariant: COLORS.gray[600],
  },
};