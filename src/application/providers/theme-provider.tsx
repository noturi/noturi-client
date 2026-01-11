import { vars } from 'nativewind';
import { ThemeId, userSettingsQuery } from '~/entities/user';
import { useUpdateSettingsMutation } from '~/features/user';
import {
  DEFAULT_THEME_ID,
  HexColors,
  PRESET_HEX_COLORS,
  PRESET_IS_DARK,
  THEME_PRESETS,
  ThemePreset,
  themeStore,
} from '~/shared/config/theme';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery } from '@tanstack/react-query';

// 색상 키 타입 정의 (useThemeColor 훅용)
export type ThemeColorKey = keyof HexColors;

interface ThemeContextValue {
  hexColors: HexColors;
  isDark: boolean;
  themeId: string;
  isLoading: boolean;
  setTheme: (themeId: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  presets: ThemePreset[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [isLoading, setIsLoading] = useState(true);

  // 서버에서 설정 조회
  const { data: serverSettings } = useQuery(userSettingsQuery());
  const updateSettingsMutation = useUpdateSettingsMutation();

  const currentTheme = useMemo(() => themeStore.getPreset(themeId), [themeId]);
  const hexColors = PRESET_HEX_COLORS[themeId];
  const isDark = PRESET_IS_DARK[themeId];

  // 초기 로딩: 로컬 → 서버 순서로 테마 적용
  useEffect(() => {
    themeStore.getThemeId().then((stored) => {
      setThemeId(stored);
      setIsLoading(false);
    });
  }, []);

  // 서버 설정이 로드되면 동기화
  useEffect(() => {
    if (serverSettings?.theme && serverSettings.theme !== themeId) {
      setThemeId(serverSettings.theme);
      themeStore.setThemeId(serverSettings.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSettings?.theme]);

  const setTheme = useCallback(
    async (newThemeId: string) => {
      // 로컬에 즉시 저장 (빠른 반응)
      await themeStore.setThemeId(newThemeId);
      setThemeId(newThemeId);

      // 서버에 저장 (백그라운드)
      updateSettingsMutation.mutate({ theme: newThemeId as ThemeId });
    },
    [updateSettingsMutation],
  );

  const toggleTheme = useCallback(async () => {
    const pairedId = currentTheme.pairedThemeId;
    if (pairedId) {
      await themeStore.setThemeId(pairedId);
      setThemeId(pairedId);
    } else {
      // pairedThemeId가 없으면 light ↔ dark 토글
      const newId = isDark ? 'light' : 'dark';
      await themeStore.setThemeId(newId);
      setThemeId(newId);
    }
  }, [currentTheme.pairedThemeId, isDark]);

  const contextValue = useMemo(
    () => ({
      hexColors,
      isDark,
      themeId,
      isLoading,
      setTheme,
      toggleTheme,
      presets: THEME_PRESETS,
    }),
    [hexColors, isDark, themeId, isLoading, setTheme, toggleTheme],
  );

  // Create CSS variables style object using NativeWind's vars()
  const themeVars = vars({
    '--color-bg-primary': currentTheme.colors.bgPrimary,
    '--color-bg-secondary': currentTheme.colors.bgSecondary,
    '--color-surface': currentTheme.colors.surface,
    '--color-text-primary': currentTheme.colors.textPrimary,
    '--color-text-secondary': currentTheme.colors.textSecondary,
    '--color-text-muted': currentTheme.colors.textMuted,
    '--color-border': currentTheme.colors.border,
    '--color-accent': currentTheme.colors.accent,
    '--color-accent-hover': currentTheme.colors.accentHover,
    '--color-accent-soft': currentTheme.colors.accentSoft,
    '--color-accent-soft-text': currentTheme.colors.accentSoftText,
    '--color-primary': currentTheme.colors.primary,
    '--color-primary-text': currentTheme.colors.primaryText,
    '--color-primary-hover': currentTheme.colors.primaryHover,
    '--color-selection': currentTheme.colors.selection,
    '--color-success': currentTheme.colors.success,
    '--color-success-text': currentTheme.colors.successText,
    '--color-success-hover': currentTheme.colors.successHover,
    '--color-success-soft': currentTheme.colors.successSoft,
    '--color-success-soft-text': currentTheme.colors.successSoftText,
    '--color-warning': currentTheme.colors.warning,
    '--color-warning-text': currentTheme.colors.warningText,
    '--color-warning-hover': currentTheme.colors.warningHover,
    '--color-warning-soft': currentTheme.colors.warningSoft,
    '--color-warning-soft-text': currentTheme.colors.warningSoftText,
    '--color-danger': currentTheme.colors.danger,
    '--color-danger-text': currentTheme.colors.dangerText,
    '--color-danger-hover': currentTheme.colors.dangerHover,
    '--color-danger-soft': currentTheme.colors.dangerSoft,
    '--color-danger-soft-text': currentTheme.colors.dangerSoftText,
  });

  return (
    <ThemeContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: hexColors.bgSecondary }}>
        <View style={[{ flex: 1 }, themeVars]}>{children}</View>
      </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
}

export function useUserTheme() {
  const context = useContext(ThemeContext);
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
 * const [accent, success, danger] = useThemeColor(['accent', 'success', 'danger']);
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
