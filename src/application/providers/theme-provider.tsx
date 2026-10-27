import { vars } from 'nativewind';
import { ThemeId, userSettingsQuery } from '~/entities/user';
import { useUpdateSettingsMutation } from '~/features/user';
import {
  DEFAULT_THEME_ID,
  PRESET_HEX_COLORS,
  PRESET_IS_DARK,
  THEME_PRESETS,
  themeStore,
} from '~/shared/config/theme';
import { ThemeContext } from '~/shared/lib/theme-context';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery } from '@tanstack/react-query';

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
  const hexColors = PRESET_HEX_COLORS[themeId] ?? PRESET_HEX_COLORS[DEFAULT_THEME_ID];
  const isDark = PRESET_IS_DARK[themeId] ?? PRESET_IS_DARK[DEFAULT_THEME_ID];

  // 초기 로딩: 로컬 → 서버 순서로 테마 적용
  useEffect(() => {
    themeStore.getThemeId().then((stored) => {
      const safeId = stored in PRESET_HEX_COLORS ? stored : DEFAULT_THEME_ID;
      if (safeId !== stored) {
        themeStore.setThemeId(safeId);
      }
      setThemeId(safeId);
      setIsLoading(false);
    });
  }, []);

  // 서버 설정이 로드되면 동기화
  useEffect(() => {
    if (serverSettings?.theme && serverSettings.theme !== themeId) {
      const safeId =
        serverSettings.theme in PRESET_HEX_COLORS ? serverSettings.theme : DEFAULT_THEME_ID;
      setThemeId(safeId);
      themeStore.setThemeId(safeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSettings?.theme]);

  // 앱 테마에 맞게 시스템 appearance 동기화 (NativeTabs 색상 문제 해결)
  useEffect(() => {
    Appearance.setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

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
    const newId = currentTheme.pairedThemeId ?? (isDark ? 'light' : 'dark');
    await setTheme(newId);
  }, [currentTheme.pairedThemeId, isDark, setTheme]);

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
    '--color-accent-soft': currentTheme.colors.accentSoft,
    '--color-accent-soft-text': currentTheme.colors.accentSoftText,
    '--color-primary': currentTheme.colors.primary,
    '--color-primary-text': currentTheme.colors.primaryText,
    '--color-selection': currentTheme.colors.selection,
    '--color-danger': currentTheme.colors.danger,
    '--color-danger-text': currentTheme.colors.dangerText,
  });

  return (
    <ThemeContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: hexColors.bgSecondary }}>
        <View style={[{ flex: 1 }, themeVars]}>{children}</View>
      </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
}
