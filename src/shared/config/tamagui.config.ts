import { createAnimations } from '@tamagui/animations-react-native';
import { tokens } from '@tamagui/config/v3';
import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';

const animations = createAnimations({
  bouncy: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
  lazy: { type: 'spring', damping: 20, stiffness: 60 },
  quick: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
});

// 시맨틱 토큰만 사용하여 간소화
const themes = {
  light: {
    // 기본 색상
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',

    // 텍스트
    textPrimary: '#212121',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textOnAccent: '#ffffff',

    // 배경
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTransparent: 'transparent',

    // 테두리
    border: '#e5e7eb',
    borderFocus: '#3b82f6',

    // 표면
    surface: '#ffffff',
  },
  dark: {
    // 기본 색상
    primary: '#f9fafb',
    secondary: '#9ca3af',
    accent: '#60a5fa',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',

    // 텍스트
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    textOnAccent: '#111827',

    // 배경
    backgroundPrimary: '#111827',
    backgroundSecondary: '#1f2937',
    backgroundTransparent: 'transparent',

    // 테두리
    border: '#374151',
    borderFocus: '#60a5fa',

    // 표면
    surface: '#1f2937',
  },
};

export const config = createTamagui({
  themes,
  animations,
  shorthands,
  tokens,

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
    allowedStyleValues: 'somewhat-strict',
  },
});

export type AppConfig = typeof config;

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
