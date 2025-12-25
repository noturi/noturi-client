import { vars } from 'nativewind';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  DEFAULT_THEME_ID,
  rgbToHex,
  ThemePreset,
  themeStore,
  THEME_PRESETS,
} from './theme-store';

interface ThemeContextValue {
  currentTheme: ThemePreset;
  themeId: string;
  isLoading: boolean;
  setTheme: (themeId: string) => Promise<void>;
  presets: ThemePreset[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [isLoading, setIsLoading] = useState(true);

  const currentTheme = useMemo(
    () => themeStore.getPreset(themeId),
    [themeId],
  );

  useEffect(() => {
    themeStore.getThemeId().then((stored) => {
      setThemeId(stored);
      setIsLoading(false);
    });
  }, []);

  const setTheme = useCallback(async (newThemeId: string) => {
    await themeStore.setThemeId(newThemeId);
    setThemeId(newThemeId);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentTheme,
      themeId,
      isLoading,
      setTheme,
      presets: THEME_PRESETS,
    }),
    [currentTheme, themeId, isLoading, setTheme],
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
    '--color-primary': currentTheme.colors.primary,
    '--color-primary-text': currentTheme.colors.primaryText,
  });

  // 배경색을 직접 적용 (노치 영역까지 커버)
  const backgroundColor = rgbToHex(currentTheme.colors.bgSecondary);

  return (
    <ThemeContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
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
