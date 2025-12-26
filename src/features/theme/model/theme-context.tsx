import { vars } from 'nativewind';

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

import {
  DEFAULT_THEME_ID,
  HexColors,
  PRESET_HEX_COLORS,
  PRESET_IS_DARK,
  THEME_PRESETS,
  ThemePreset,
  themeStore,
} from './theme-store';

interface ThemeContextValue {
  hexColors: HexColors;
  isDark: boolean;
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

  const currentTheme = useMemo(() => themeStore.getPreset(themeId), [themeId]);
  const hexColors = PRESET_HEX_COLORS[themeId];
  const isDark = PRESET_IS_DARK[themeId];

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
      hexColors,
      isDark,
      themeId,
      isLoading,
      setTheme,
      presets: THEME_PRESETS,
    }),
    [hexColors, isDark, themeId, isLoading, setTheme],
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
    '--color-selection': currentTheme.colors.selection,
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
