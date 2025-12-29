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
    accentText: string;
    // 버튼
    primary: string;
    primaryText: string;
    // 선택 상태 (보더, 텍스트)
    selection: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light',
    name: '화이트',
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
      accentText: '29 29 29',
      primary: '29 29 29',
      primaryText: '255 255 255',
      selection: '29 29 29',
    },
  },
  {
    id: 'dark',
    name: '블랙',
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
      accentText: '29 29 29',
      primary: '255 255 255',
      primaryText: '18 18 18',
      selection: '255 255 255',
    },
  },
  {
    id: 'sepia',
    name: '선셋',
    isDark: false,
    colors: {
      bgPrimary: '255 247 240',
      bgSecondary: '255 238 228',
      surface: '255 247 240',
      textPrimary: '100 45 35',
      textSecondary: '160 95 75',
      textMuted: '195 140 120',
      border: '250 200 175',
      accent: '255 100 65',
      accentText: '80 30 20',
      primary: '100 45 35',
      primaryText: '255 247 240',
      selection: '100 45 35',
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
      textPrimary: '225 240 255',
      textSecondary: '175 200 230',
      textMuted: '130 155 190',
      border: '71 85 105',
      accent: '56 189 248',
      accentText: '15 23 42',
      primary: '225 240 255',
      primaryText: '15 23 42',
      selection: '56 189 248',
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
      textPrimary: '225 250 235',
      textSecondary: '175 215 190',
      textMuted: '125 165 145',
      border: '60 80 70',
      accent: '74 222 128',
      accentText: '20 30 26',
      primary: '225 250 235',
      primaryText: '20 30 26',
      selection: '74 222 128',
    },
  },
  {
    id: 'lavender',
    name: '퍼플',
    isDark: true,
    colors: {
      bgPrimary: '25 20 35',
      bgSecondary: '35 28 50',
      surface: '48 40 65',
      textPrimary: '240 230 255',
      textSecondary: '200 185 230',
      textMuted: '155 140 190',
      border: '70 60 95',
      accent: '180 130 255',
      accentText: '25 20 35',
      primary: '240 230 255',
      primaryText: '25 20 35',
      selection: '180 130 255',
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
  accentText: string;
  primary: string;
  primaryText: string;
  selection: string;
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
    accentText: rgbToHex(colors.accentText),
    primary: rgbToHex(colors.primary),
    primaryText: rgbToHex(colors.primaryText),
    selection: rgbToHex(colors.selection),
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
