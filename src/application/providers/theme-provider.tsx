import { vars } from 'nativewind';
import { authStore } from '~/entities/auth';
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

import { ReactNode, useEffect, useState, useSyncExternalStore } from 'react';
import { Appearance, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery } from '@tanstack/react-query';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [isLoading, setIsLoading] = useState(true);

  // 테마는 계정 설정 — 로그인한 계정의 서버 설정에서 가져옴
  // (ThemeProvider는 로그인 화면도 감싸야 해서 AuthProvider 바깥에 있으므로 authStore를 직접 구독)
  const auth = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const accountId = auth.isAuthenticated ? auth.user?.id : undefined;
  const { data: serverSettings } = useQuery({
    ...userSettingsQuery(),
    enabled: Boolean(accountId),
  });
  const updateSettingsMutation = useUpdateSettingsMutation();

  const currentTheme = themeStore.getPreset(themeId);
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

  // 계정 전환 감지 (렌더 중 상태 조정) — 로그아웃하면 기본 테마, 다른 계정이면 그 계정 테마를 새로 적용
  const [appliedServerThemeId, setAppliedServerThemeId] = useState<string | undefined>(undefined);
  const [currentAccountId, setCurrentAccountId] = useState<string | undefined>(undefined);
  if (!auth.isInitialLoading && accountId !== currentAccountId) {
    setCurrentAccountId(accountId);
    setAppliedServerThemeId(undefined);
    if (!accountId) setThemeId(DEFAULT_THEME_ID);
  }

  // 계정의 서버 테마 적용 — 상태는 렌더 중 조정, 로컬 캐시 저장만 effect에서
  const serverThemeId = serverSettings?.theme
    ? serverSettings.theme in PRESET_HEX_COLORS
      ? serverSettings.theme
      : DEFAULT_THEME_ID
    : undefined;
  if (accountId && serverThemeId && serverThemeId !== appliedServerThemeId) {
    setAppliedServerThemeId(serverThemeId);
    setThemeId(serverThemeId);
  }

  // 로컬 저장은 앱 시작 시 깜빡임 방지용 캐시 — 현재 계정의 테마(로그아웃이면 기본값)를 저장
  const isLoggedOut = !auth.isInitialLoading && !accountId;
  useEffect(() => {
    if (isLoggedOut) themeStore.setThemeId(DEFAULT_THEME_ID);
    else if (serverThemeId) themeStore.setThemeId(serverThemeId);
  }, [isLoggedOut, serverThemeId]);

  // 앱 테마에 맞게 시스템 appearance 동기화 (NativeTabs 색상 문제 해결)
  useEffect(() => {
    Appearance.setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const setTheme = async (newThemeId: string) => {
    // 로컬에 즉시 저장 (빠른 반응)
    await themeStore.setThemeId(newThemeId);
    setThemeId(newThemeId);

    // 서버에 저장 (백그라운드)
    updateSettingsMutation.mutate({ theme: newThemeId as ThemeId });
  };

  const toggleTheme = async () => {
    const newId = currentTheme.pairedThemeId ?? (isDark ? 'light' : 'dark');
    await setTheme(newId);
  };

  const contextValue = {
    hexColors,
    isDark,
    themeId,
    isLoading,
    setTheme,
    toggleTheme,
    presets: THEME_PRESETS,
  };

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
    '--color-link': currentTheme.colors.link,
  });

  return (
    <ThemeContext value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: hexColors.bgSecondary }}>
        <View style={[{ flex: 1 }, themeVars]}>{children}</View>
      </GestureHandlerRootView>
    </ThemeContext>
  );
}
