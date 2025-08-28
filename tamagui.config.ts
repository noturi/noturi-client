import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui, createTokens } from '@tamagui/core';
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

    star: '#ff0',

    textPrimary: '#212121',
    textSecondary: '#757575',
    textMuted: '#9e9e9e',
    textOnAccent: '#000000',
    textOnPrimary: '#ffffff',

    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundTransparent: 'transparent',
    backgroundOverlay: 'rgba(0,0,0,0.5)',

    border: '#e0e0e0',
    borderFocus: '#ffc107',

    surface: '#ffffff',
  },
};

const bodyFont = createFont({
  family: 'System',
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    true: 14,
  },
  lineHeight: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  weight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
  },
  face: {
    300: { normal: 'System' },
    400: { normal: 'System' },
    500: { normal: 'System' },
    600: { normal: 'System' },
    700: { normal: 'System' },
  },
});

const headingFont = createFont({
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
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
    true: '600',
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
  },
  face: {
    300: { normal: 'System' },
    400: { normal: 'System' },
    500: { normal: 'System' },
    600: { normal: 'System' },
    700: { normal: 'System' },
  },
});

const tokens = createTokens({
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

    star: '#ffd700',

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

    border: '#fafafa',
    borderHover: '#bdbdbd',

    backgroundTransparent: 'transparent',
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundOverlay: 'rgba(0,0,0,0.5)',
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
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
    '5xl': 88,
    '6xl': 120,
    '7xl': 150,
    full: '100%',
    true: 16,
    false: 0,
  },
  borderWidth: {
    0: 0,
    1: 1,
    2: 2,
    4: 4,
    true: 1,
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
});

const fonts = {
  body: bodyFont,
  heading: headingFont,
};

export const config = createTamagui({
  themes,
  fonts,
  animations,
  shorthands,
  tokens,
  defaultFont: 'body',
  settings: {
    allowedStyleValues: 'strict',
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
