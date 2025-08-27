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
    primary: '#1d1d1d',
    secondary: '#71767b',
    accent: '#ffc107',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',

    star: '#ebd759',

    textPrimary: '#212121',
    textSecondary: '#757575',
    textMuted: '#9e9e9e',
    textOnAccent: '#000000',
    textOnPrimary: '#ffffff',

    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundTransparent: 'transparent',

    border: '#e0e0e0',
    borderFocus: '#ffc107',

    surface: '#ffffff',
  },
};

export const config = createTamagui({
  themes,
  animations,
  shorthands,

  tokens: {
    color: {
      primary: '#1d1d1d',
      primaryHover: '#2a2a2a',
      primaryActive: '#404040',

      secondary: '#71767b',
      secondaryHover: '#8b9199',
      secondaryActive: '#a1a8b0',

      accent: '#ffc107',
      accentHover: '#ffb300',
      accentActive: '#ffa000',

      success: '#4caf50',
      successHover: '#43a047',

      error: '#f44336',
      errorHover: '#e53935',

      star: '#ebd759',

      warning: '#ff9800',
      warningHover: '#fb8c00',

      surface: '#ffffff',
      surfaceHover: '#f5f5f5',
      surfaceDisabled: '#eeeeee',

      textPrimary: '#212121',
      textSecondary: '#757575',
      textMuted: '#9e9e9e',
      textOnAccent: '#000000',
      textOnPrimary: '#ffffff',

      border: '#e0e0e0',
      borderHover: '#bdbdbd',

      backgroundTransparent: 'transparent',
      backgroundPrimary: '#ffffff',
      backgroundSecondary: '#f5f5f5',
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
