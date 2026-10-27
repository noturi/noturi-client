import { HexColors, ThemePreset } from '~/shared/config/theme';

import { createContext, use } from 'react';

// 색상 키 타입 정의 (useThemeColor 훅용)
export type ThemeColorKey = keyof HexColors;

export interface ThemeContextValue {
  hexColors: HexColors;
  isDark: boolean;
  themeId: string;
  isLoading: boolean;
  setTheme: (themeId: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  presets: ThemePreset[];
}

// Provider 구현(서버 설정 동기화)은 application 레이어에 있고, 하위 레이어는 이 훅만 사용한다
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useUserTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useUserTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * 특정 테마 색상을 가져오는 훅
 *
 * @example
 * // 단일 색상
 * const accentColor = useThemeColor('accent');
 *
 * @example
 * // 여러 색상
 * const [accent, danger] = useThemeColor(['accent', 'danger']);
 */
export function useThemeColor<T extends ThemeColorKey>(colorKey: T): string;
export function useThemeColor<T extends readonly [ThemeColorKey, ...ThemeColorKey[]]>(
  colorKeys: T,
): { [K in keyof T]: string };
export function useThemeColor(colorKeyOrKeys: ThemeColorKey | ThemeColorKey[]): string | string[] {
  const { hexColors } = useUserTheme();

  if (Array.isArray(colorKeyOrKeys)) {
    return colorKeyOrKeys.map((key) => hexColors[key]);
  }

  return hexColors[colorKeyOrKeys];
}
