import * as SecureStore from 'expo-secure-store';

// 프리셋 테마 정의
export interface ThemePreset {
  id: string;
  name: string;
  isDark: boolean;
  // 대응되는 light/dark 테마 ID (토글용)
  pairedThemeId?: string;
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
    accentHover: string;
    accentSoft: string;
    accentSoftText: string;
    // 버튼
    primary: string;
    primaryText: string;
    primaryHover: string;
    // 선택 상태 (보더, 텍스트)
    selection: string;
    // 상태 색상 - Success
    success: string;
    successText: string;
    successHover: string;
    successSoft: string;
    successSoftText: string;
    // 상태 색상 - Warning
    warning: string;
    warningText: string;
    warningHover: string;
    warningSoft: string;
    warningSoftText: string;
    // 상태 색상 - Danger
    danger: string;
    dangerText: string;
    dangerHover: string;
    dangerSoft: string;
    dangerSoftText: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light',
    name: '화이트',
    isDark: false,
    pairedThemeId: 'dark',
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
      accentHover: '255 179 0',
      accentSoft: '255 243 224',
      accentSoftText: '230 150 0',
      primary: '29 29 29',
      primaryText: '255 255 255',
      primaryHover: '50 50 50',
      selection: '29 29 29',
      success: '34 197 94',
      successText: '255 255 255',
      successHover: '22 163 74',
      successSoft: '220 252 231',
      successSoftText: '22 101 52',
      warning: '245 158 11',
      warningText: '255 255 255',
      warningHover: '217 119 6',
      warningSoft: '254 243 199',
      warningSoftText: '146 64 14',
      danger: '239 68 68',
      dangerText: '255 255 255',
      dangerHover: '220 38 38',
      dangerSoft: '254 226 226',
      dangerSoftText: '153 27 27',
    },
  },
  {
    id: 'dark',
    name: '블랙',
    isDark: true,
    pairedThemeId: 'light',
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
      accentHover: '255 213 79',
      accentSoft: '50 45 30',
      accentSoftText: '255 213 79',
      primary: '255 255 255',
      primaryText: '18 18 18',
      primaryHover: '220 220 220',
      selection: '255 255 255',
      success: '74 222 128',
      successText: '18 18 18',
      successHover: '34 197 94',
      successSoft: '30 50 35',
      successSoftText: '134 239 172',
      warning: '251 191 36',
      warningText: '18 18 18',
      warningHover: '245 158 11',
      warningSoft: '50 45 25',
      warningSoftText: '253 224 71',
      danger: '248 113 113',
      dangerText: '18 18 18',
      dangerHover: '239 68 68',
      dangerSoft: '50 30 30',
      dangerSoftText: '252 165 165',
    },
  },
  {
    id: 'sepia',
    name: '선셋',
    isDark: false,
    pairedThemeId: 'navy',
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
      accentHover: '235 80 45',
      accentSoft: '255 220 210',
      accentSoftText: '200 70 40',
      primary: '100 45 35',
      primaryText: '255 247 240',
      primaryHover: '130 60 45',
      selection: '100 45 35',
      success: '34 180 90',
      successText: '255 255 255',
      successHover: '28 150 75',
      successSoft: '220 245 225',
      successSoftText: '25 120 60',
      warning: '235 140 30',
      warningText: '80 30 20',
      warningHover: '210 120 20',
      warningSoft: '255 235 200',
      warningSoftText: '160 90 20',
      danger: '220 60 60',
      dangerText: '255 255 255',
      dangerHover: '190 45 45',
      dangerSoft: '255 215 215',
      dangerSoftText: '160 40 40',
    },
  },
  {
    id: 'navy',
    name: '네이비',
    isDark: true,
    pairedThemeId: 'sepia',
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
      accentHover: '96 209 255',
      accentSoft: '30 50 75',
      accentSoftText: '125 211 252',
      primary: '225 240 255',
      primaryText: '15 23 42',
      primaryHover: '200 220 245',
      selection: '56 189 248',
      success: '74 222 128',
      successText: '15 23 42',
      successHover: '34 197 94',
      successSoft: '25 50 40',
      successSoftText: '134 239 172',
      warning: '251 191 36',
      warningText: '15 23 42',
      warningHover: '245 158 11',
      warningSoft: '50 45 30',
      warningSoftText: '253 224 71',
      danger: '248 113 113',
      dangerText: '15 23 42',
      dangerHover: '239 68 68',
      dangerSoft: '60 35 40',
      dangerSoftText: '252 165 165',
    },
  },
  {
    id: 'forest',
    name: '포레스트',
    isDark: true,
    pairedThemeId: 'light',
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
      accentHover: '110 235 155',
      accentSoft: '35 55 45',
      accentSoftText: '134 239 172',
      primary: '225 250 235',
      primaryText: '20 30 26',
      primaryHover: '200 235 215',
      selection: '74 222 128',
      success: '74 222 128',
      successText: '20 30 26',
      successHover: '110 235 155',
      successSoft: '35 55 45',
      successSoftText: '134 239 172',
      warning: '251 191 36',
      warningText: '20 30 26',
      warningHover: '245 158 11',
      warningSoft: '50 50 35',
      warningSoftText: '253 224 71',
      danger: '248 113 113',
      dangerText: '20 30 26',
      dangerHover: '239 68 68',
      dangerSoft: '55 40 40',
      dangerSoftText: '252 165 165',
    },
  },
  {
    id: 'lavender',
    name: '퍼플',
    isDark: true,
    pairedThemeId: 'light',
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
      accentHover: '200 160 255',
      accentSoft: '50 40 70',
      accentSoftText: '200 170 255',
      primary: '240 230 255',
      primaryText: '25 20 35',
      primaryHover: '220 210 245',
      selection: '180 130 255',
      success: '74 222 128',
      successText: '25 20 35',
      successHover: '110 235 155',
      successSoft: '35 50 45',
      successSoftText: '134 239 172',
      warning: '251 191 36',
      warningText: '25 20 35',
      warningHover: '245 158 11',
      warningSoft: '55 50 35',
      warningSoftText: '253 224 71',
      danger: '248 113 113',
      dangerText: '25 20 35',
      dangerHover: '239 68 68',
      dangerSoft: '55 35 45',
      dangerSoftText: '252 165 165',
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
  accentHover: string;
  accentSoft: string;
  accentSoftText: string;
  primary: string;
  primaryText: string;
  primaryHover: string;
  selection: string;
  success: string;
  successText: string;
  successHover: string;
  successSoft: string;
  successSoftText: string;
  warning: string;
  warningText: string;
  warningHover: string;
  warningSoft: string;
  warningSoftText: string;
  danger: string;
  dangerText: string;
  dangerHover: string;
  dangerSoft: string;
  dangerSoftText: string;
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
    accentHover: rgbToHex(colors.accentHover),
    accentSoft: rgbToHex(colors.accentSoft),
    accentSoftText: rgbToHex(colors.accentSoftText),
    primary: rgbToHex(colors.primary),
    primaryText: rgbToHex(colors.primaryText),
    primaryHover: rgbToHex(colors.primaryHover),
    selection: rgbToHex(colors.selection),
    success: rgbToHex(colors.success),
    successText: rgbToHex(colors.successText),
    successHover: rgbToHex(colors.successHover),
    successSoft: rgbToHex(colors.successSoft),
    successSoftText: rgbToHex(colors.successSoftText),
    warning: rgbToHex(colors.warning),
    warningText: rgbToHex(colors.warningText),
    warningHover: rgbToHex(colors.warningHover),
    warningSoft: rgbToHex(colors.warningSoft),
    warningSoftText: rgbToHex(colors.warningSoftText),
    danger: rgbToHex(colors.danger),
    dangerText: rgbToHex(colors.dangerText),
    dangerHover: rgbToHex(colors.dangerHover),
    dangerSoft: rgbToHex(colors.dangerSoft),
    dangerSoftText: rgbToHex(colors.dangerSoftText),
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
