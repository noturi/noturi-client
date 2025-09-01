import { createAnimations } from '@tamagui/animations-react-native';
import { config as configBase } from '@tamagui/config/v3';
import { createFont, createTamagui, createTokens } from '@tamagui/core';

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

    star: '#ffd700',

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

    // Rating colors and backgrounds
    rating0Background: '#f5f5f5',
    rating1: '#ff6b35',
    rating1Background: '#fff2ed',
    rating2: '#ffa726',
    rating2Background: '#fff8e1',
    rating3: '#66bb6a',
    rating3Background: '#f1f8e9',
    rating4: '#42a5f5',
    rating4Background: '#e3f2fd',
    rating5: '#7e57c2',
    rating5Background: '#f3e5f5',
  },
};

const fontSize = {
  xs: 10,
  sm: 12,
  base: 14, // md 대신 base 사용
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  true: 14,
};

const bodyFont = createFont({
  family: 'System',
  size: fontSize,
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
    normal: 0,
    tight: -0.5,
  },
  face: {
    light: { normal: 'System', italic: 'System' },
    regular: { normal: 'System', italic: 'System' },
    medium: { normal: 'System', italic: 'System' },
    semibold: { normal: 'System', italic: 'System' },
    bold: { normal: 'System', italic: 'System' },
  },
});

const headingFont = createFont({
  family: 'System',
  size: fontSize,
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    '2xl': 24,
    '3xl': 26,
    '4xl': 30,
    '5xl': 34,
    '6xl': 38,
    true: 22,
  },
  weight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    true: '600',
  },
  letterSpacing: {
    normal: 0,
    tight: -0.5,
  },
  face: {
    light: { normal: 'System', italic: 'System' },
    regular: { normal: 'System', italic: 'System' },
    medium: { normal: 'System', italic: 'System' },
    semibold: { normal: 'System', italic: 'System' },
    bold: { normal: 'System', italic: 'System' },
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

    // Rating colors and backgrounds
    rating0Background: '#f5f5f5',
    rating1: '#ff6b35',
    rating1Background: '#fff2ed',
    rating2: '#ffa726',
    rating2Background: '#fff8e1',
    rating3: '#66bb6a',
    rating3Background: '#f1f8e9',
    rating4: '#42a5f5',
    rating4Background: '#e3f2fd',
    rating5: '#7e57c2',
    rating5Background: '#f3e5f5',
  },
  fontWeight: {
    light: '300',
    regular: '400', 
    medium: '500',
    semibold: '600',
    bold: '700',
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
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
  },
  space: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 14,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
    '5xl': 64,
    '6xl': 88,
    '7xl': 120,
    // 폰트 사이즈용
    textXs: 10,
    textSm: 12, 
    textMd: 14,
    textLg: 16,
    textXl: 18,
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
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
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
  zIndex: { base: 0, low: 100, medium: 200, high: 300, higher: 400, highest: 500 },
});

export const config = createTamagui({
  ...configBase,
  themes,
  fonts: {
    ...configBase.fonts,
    body: bodyFont,
    heading: headingFont,
  },
  animations,
  tokens: {
    ...configBase.tokens,
    ...tokens,
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
