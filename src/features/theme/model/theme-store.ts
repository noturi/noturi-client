import * as SecureStore from 'expo-secure-store';

// 프리셋 테마 정의
export interface ThemePreset {
  id: string;
  name: string;
  isDark: boolean;
  colors: {
    // 배경
    bgPrimary: string;
    bgSecondary: string;
    surface: string;
    // 텍스트
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    // 테두리
    border: string;
    // 액센트 (포인트 색상)
    accent: string;
    // 버튼
    primary: string;
    primaryText: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light',
    name: '라이트',
    isDark: false,
    colors: {
      bgPrimary: '255 255 255',
      bgSecondary: '245 245 245',
      surface: '255 255 255',
      textPrimary: '33 33 33',
      textSecondary: '117 117 117',
      textMuted: '158 158 158',
      border: '224 224 224',
      accent: '255 193 7',
      primary: '29 29 29',
      primaryText: '255 255 255',
    },
  },
  {
    id: 'dark',
    name: '다크',
    isDark: true,
    colors: {
      bgPrimary: '18 18 18',
      bgSecondary: '30 30 30',
      surface: '38 38 38',
      textPrimary: '255 255 255',
      textSecondary: '179 179 179',
      textMuted: '128 128 128',
      border: '64 64 64',
      accent: '255 193 7',
      primary: '255 255 255',
      primaryText: '18 18 18',
    },
  },
  {
    id: 'sepia',
    name: '세피아',
    isDark: false,
    colors: {
      bgPrimary: '251 248 241',
      bgSecondary: '245 240 230',
      surface: '251 248 241',
      textPrimary: '62 50 37',
      textSecondary: '107 90 70',
      textMuted: '148 132 112',
      border: '220 210 190',
      accent: '180 120 60',
      primary: '62 50 37',
      primaryText: '251 248 241',
    },
  },
  {
    id: 'navy',
    name: '네이비',
    isDark: true,
    colors: {
      bgPrimary: '15 23 42',
      bgSecondary: '30 41 59',
      surface: '51 65 85',
      textPrimary: '241 245 249',
      textSecondary: '203 213 225',
      textMuted: '148 163 184',
      border: '71 85 105',
      accent: '56 189 248',
      primary: '241 245 249',
      primaryText: '15 23 42',
    },
  },
  {
    id: 'forest',
    name: '포레스트',
    isDark: true,
    colors: {
      bgPrimary: '20 30 26',
      bgSecondary: '32 45 38',
      surface: '45 60 52',
      textPrimary: '236 253 245',
      textSecondary: '187 220 200',
      textMuted: '134 170 150',
      border: '60 80 70',
      accent: '74 222 128',
      primary: '236 253 245',
      primaryText: '20 30 26',
    },
  },
];

export const DEFAULT_THEME_ID = 'light';

const THEME_STORAGE_KEY = 'user-theme-preset';

export const themeStore = {
  async getThemeId(): Promise<string> {
    try {
      const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
      return stored ?? DEFAULT_THEME_ID;
    } catch {
      return DEFAULT_THEME_ID;
    }
  },

  async setThemeId(themeId: string): Promise<void> {
    await SecureStore.setItemAsync(THEME_STORAGE_KEY, themeId);
  },

  async resetTheme(): Promise<void> {
    await SecureStore.deleteItemAsync(THEME_STORAGE_KEY);
  },

  getPreset(themeId: string): ThemePreset {
    return THEME_PRESETS.find((t) => t.id === themeId) ?? THEME_PRESETS[0];
  },
};

// RGB string to hex conversion utility
export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(' ').map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 프리셋별 hex 색상 (미리 계산)
export type HexColors = {
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
};

function convertColorsToHex(colors: ThemePreset['colors']): HexColors {
  return {
    bgPrimary: rgbToHex(colors.bgPrimary),
    bgSecondary: rgbToHex(colors.bgSecondary),
    surface: rgbToHex(colors.surface),
    textPrimary: rgbToHex(colors.textPrimary),
    textSecondary: rgbToHex(colors.textSecondary),
    textMuted: rgbToHex(colors.textMuted),
    border: rgbToHex(colors.border),
    accent: rgbToHex(colors.accent),
    primary: rgbToHex(colors.primary),
    primaryText: rgbToHex(colors.primaryText),
  };
}

// 프리셋 ID -> hex 색상 맵 (앱 시작 시 한번만 계산)
export const PRESET_HEX_COLORS: Record<string, HexColors> = Object.fromEntries(
  THEME_PRESETS.map((preset) => [preset.id, convertColorsToHex(preset.colors)]),
);

// 프리셋 ID -> isDark 맵
export const PRESET_IS_DARK: Record<string, boolean> = Object.fromEntries(
  THEME_PRESETS.map((preset) => [preset.id, preset.isDark]),
);
