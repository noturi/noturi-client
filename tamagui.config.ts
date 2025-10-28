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
    textNumber: '#2196f3', // 파란색

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
  1: 10,
  2: 12,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 24,
  true: 14,
};

const bodyFont = createFont({
  family:
    'Pretendard-Regular, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
  size: fontSize,
  lineHeight: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
  },
  weight: {
    1: '200',
    2: '300',
    3: '400',
    4: '500',
    5: '600',
    6: '700',
    true: '400',
  },
  letterSpacing: {
    normal: 0,
    tight: -0.5,
  },
  face: {
    200: { normal: 'Pretendard-ExtraLight', italic: 'Pretendard-ExtraLight' },
    300: { normal: 'Pretendard-Light', italic: 'Pretendard-Light' },
    400: { normal: 'Pretendard-Regular', italic: 'Pretendard-Regular' },
    500: { normal: 'Pretendard-Medium', italic: 'Pretendard-Medium' },
    600: { normal: 'Pretendard-SemiBold', italic: 'Pretendard-SemiBold' },
    700: { normal: 'Pretendard-Bold', italic: 'Pretendard-Bold' },
  },
});

const headingFont = createFont({
  family:
    'Pretendard-Regular, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
  size: fontSize,
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
    1: '200',
    2: '300',
    3: '400',
    4: '500',
    5: '600',
    6: '700',
    true: '600',
  },
  letterSpacing: {
    normal: 0,
    tight: -0.5,
  },
  face: {
    200: { normal: 'Pretendard-ExtraLight', italic: 'Pretendard-ExtraLight' },
    300: { normal: 'Pretendard-Light', italic: 'Pretendard-Light' },
    400: { normal: 'Pretendard-Regular', italic: 'Pretendard-Regular' },
    500: { normal: 'Pretendard-Medium', italic: 'Pretendard-Medium' },
    600: { normal: 'Pretendard-SemiBold', italic: 'Pretendard-SemiBold' },
    700: { normal: 'Pretendard-Bold', italic: 'Pretendard-Bold' },
  },
});

const tokens = createTokens({
  color: {
    1: '#ffffff',
    2: '#000000',
    3: 'transparent',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
    accent: '#ffc107',
  },
  space: {
    0: 0,
    1: 2,
    2: 4,
    3: 8,
    4: 12,
    5: 16,
    6: 24,
    7: 32,
    8: 48,
    9: 64,
    10: 88,
    11: 120,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
    7: 48,
    8: 64,
    9: 88,
    10: 120,
    11: 150,
    12: '100%',
  },
  borderWidth: {
    0: 0,
    1: 1,
    2: 2,
    3: 4,
  },
  radius: {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 12,
    6: 16,
    7: 20,
    8: 9999,
  },
  fontWeight: {
    1: '200',
    2: '300',
    3: '400',
    4: '500',
    5: '600',
    6: '700',
  },
  zIndex: {
    1: 0,
    2: 100,
    3: 200,
    4: 300,
    5: 400,
    6: 500,
  },
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
