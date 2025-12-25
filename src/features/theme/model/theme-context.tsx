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

import { DEFAULT_THEME_ID, THEME_PRESETS, ThemePreset, rgbToHex, themeStore } from './theme-store';

interface HexColors {
  bgPrimary: string;
  bgSecondary: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  primary: string;
  primaryText: string;
}

interface ThemeContextValue {
  currentTheme: ThemePreset;
  hexColors: HexColors;
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

  const hexColors = useMemo<HexColors>(
    () => ({
      bgPrimary: rgbToHex(currentTheme.colors.bgPrimary),
      bgSecondary: rgbToHex(currentTheme.colors.bgSecondary),
      surface: rgbToHex(currentTheme.colors.surface),
      textPrimary: rgbToHex(currentTheme.colors.textPrimary),
      textSecondary: rgbToHex(currentTheme.colors.textSecondary),
      textMuted: rgbToHex(currentTheme.colors.textMuted),
      border: rgbToHex(currentTheme.colors.border),
      accent: rgbToHex(currentTheme.colors.accent),
      primary: rgbToHex(currentTheme.colors.primary),
      primaryText: rgbToHex(currentTheme.colors.primaryText),
    }),
    [currentTheme],
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
      hexColors,
      themeId,
      isLoading,
      setTheme,
      presets: THEME_PRESETS,
    }),
    [currentTheme, hexColors, themeId, isLoading, setTheme],
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
