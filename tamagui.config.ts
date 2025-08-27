import { createAnimations } from '@tamagui/animations-react-native';
import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';

const animations = createAnimations({
  bouncy: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
  lazy: { type: 'spring', damping: 20, stiffness: 60 },
  quick: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
});

const themes = {
  light: {
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',

    textPrimary: '#212121',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textOnAccent: '#ffffff',
    textOnPrimary: '#ffffff',

    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTransparent: 'transparent',

    border: '#e5e7eb',
    borderFocus: '#3b82f6',

    surface: '#ffffff',
  },
};

export const config = createTamagui({
  themes,
  animations,
  shorthands,

  tokens: {
    color: {
      primary: '#1f2937',
      primaryHover: '#374151',
      primaryActive: '#111827',

      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      secondaryActive: '#374151',

      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentActive: '#1d4ed8',

      success: '#22c55e',
      successHover: '#16a34a',

      error: '#ef4444',
      errorHover: '#dc2626',

      warning: '#f59e0b',
      warningHover: '#d97706',

      surface: '#ffffff',
      surfaceHover: '#f9fafb',
      surfaceDisabled: '#f3f4f6',

      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      textOnAccent: '#ffffff',
      textOnPrimary: '#ffffff',

      border: '#e5e7eb',
      borderHover: '#d1d5db',
    },
    space: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      '2xl': 24,
      '3xl': 32,
      '4xl': 48,
      '5xl': 64,
      '6xl': 88,
      '7xl': 120,
      true: 8,
      false: 0,
    },
    size: {
      none: 0,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
      '4xl': 88,
      '5xl': 120,
      '6xl': 150,
      full: '100%',
      true: 16,
      false: 0,
    },
    radius: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 20,
      full: 9999,
      true: 4,
      false: 0,
    },
    zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 },
  },

  fonts: {
    body: {
      family: 'System',
      size: {
        1: 10,
        2: 11,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 28,
        10: 32,
        true: 14,
      },
      lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        true: 20,
      },
      weight: { 1: '300', 2: '400', 3: '500', 4: '600', 5: '700', true: '400' },
    },
    heading: {
      family: 'System',
      size: {
        1: 10,
        2: 11,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 28,
        10: 32,
        true: 16,
      },
      lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 26,
        8: 30,
        9: 34,
        10: 38,
        true: 22,
      },
      weight: { 1: '300', 2: '400', 3: '500', 4: '600', 5: '700', true: '600' },
    },
  },

  settings: {
    allowedStyleValues: 'strict',
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
