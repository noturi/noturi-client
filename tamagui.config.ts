import { createAnimations } from "@tamagui/animations-react-native";
import { createTamagui } from "@tamagui/core";
import { shorthands } from "@tamagui/shorthands";
import { createThemes, defaultComponentThemes } from "@tamagui/theme-builder";

const darkPalette = [
  "hsla(0, 0%, 8%, 1)", // 0: 진한 배경
  "hsla(0, 0%, 12%, 1)", // 1: 카드 배경
  "hsla(0, 0%, 16%, 1)", // 2: 보더
  "hsla(0, 0%, 20%, 1)", // 3: 입력 필드
  "hsla(0, 0%, 28%, 1)", // 4: 비활성 텍스트
  "hsla(0, 0%, 36%, 1)", // 5: 보조 텍스트
  "hsla(0, 0%, 48%, 1)", // 6: 일반 텍스트
  "hsla(0, 0%, 60%, 1)", // 7: 강조 텍스트
  "hsla(0, 0%, 72%, 1)", // 8: 제목
  "hsla(0, 0%, 84%, 1)", // 9: 밝은 텍스트
  "hsla(0, 0%, 92%, 1)", // 10: 가장 밝은 텍스트
  "hsla(0, 0%, 98%, 1)", // 11: 화이트
];

const lightPalette = [
  "hsla(0, 0%, 98%, 1)", // 0: 밝은 배경
  "hsla(0, 0%, 95%, 1)", // 1: 카드 배경
  "hsla(0, 0%, 90%, 1)", // 2: 보더
  "hsla(0, 0%, 85%, 1)", // 3: 입력 필드
  "hsla(0, 0%, 68%, 1)", // 4: 비활성 텍스트
  "hsla(0, 0%, 56%, 1)", // 5: 보조 텍스트
  "hsla(0, 0%, 44%, 1)", // 6: 일반 텍스트
  "hsla(0, 0%, 32%, 1)", // 7: 강조 텍스트
  "hsla(0, 0%, 20%, 1)", // 8: 제목
  "hsla(0, 0%, 12%, 1)", // 9: 진한 텍스트
  "hsla(0, 0%, 8%, 1)", // 10: 가장 진한 텍스트
  "hsla(0, 0%, 4%, 1)", // 11: 블랙
];

const accentBlue = {
  dark: [
    "hsla(210, 40%, 20%, 1)",
    "hsla(210, 40%, 25%, 1)",
    "hsla(210, 40%, 30%, 1)",
    "hsla(210, 40%, 35%, 1)",
    "hsla(210, 50%, 40%, 1)",
    "hsla(210, 60%, 45%, 1)",
    "hsla(210, 70%, 50%, 1)",
    "hsla(210, 80%, 55%, 1)",
    "hsla(210, 85%, 65%, 1)",
    "hsla(210, 90%, 75%, 1)",
    "hsla(210, 95%, 85%, 1)",
    "hsla(210, 100%, 95%, 1)",
  ],
  light: [
    "hsla(210, 100%, 97%, 1)",
    "hsla(210, 90%, 92%, 1)",
    "hsla(210, 85%, 87%, 1)",
    "hsla(210, 80%, 82%, 1)",
    "hsla(210, 75%, 75%, 1)",
    "hsla(210, 70%, 65%, 1)",
    "hsla(210, 65%, 55%, 1)",
    "hsla(210, 60%, 45%, 1)",
    "hsla(210, 55%, 35%, 1)",
    "hsla(210, 50%, 25%, 1)",
    "hsla(210, 45%, 15%, 1)",
    "hsla(210, 40%, 10%, 1)",
  ],
};

const lightShadows = {
  shadow1: "rgba(0,0,0,0.02)",
  shadow2: "rgba(0,0,0,0.04)",
  shadow3: "rgba(0,0,0,0.08)",
  shadow4: "rgba(0,0,0,0.12)",
  shadow5: "rgba(0,0,0,0.16)",
  shadow6: "rgba(0,0,0,0.20)",
};

const darkShadows = {
  shadow1: "rgba(0,0,0,0.15)",
  shadow2: "rgba(0,0,0,0.25)",
  shadow3: "rgba(0,0,0,0.35)",
  shadow4: "rgba(0,0,0,0.45)",
  shadow5: "rgba(0,0,0,0.55)",
  shadow6: "rgba(0,0,0,0.65)",
};

const themes = createThemes({
  componentThemes: defaultComponentThemes,
  base: {
    palette: { dark: darkPalette, light: lightPalette },
    extra: {
      light: {
        green9: "#22c55e",
        green10: "#16a34a",
        red9: "#ef4444",
        red10: "#dc2626",
        yellow9: "#f59e0b",
        yellow10: "#d97706",
        ...lightShadows,
        shadowColor: lightShadows.shadow1,

        primary: "#1f2937",
        primaryHover: "#374151",
        secondary: "#6b7280",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#6b7280",

        surface: "#ffffff",
        surfaceHover: "#f9fafb",
        surfaceActive: "#f3f4f6",

        textPrimary: "#111827",
        textSecondary: "#6b7280",
        textMuted: "#9ca3af",

        border: "#e5e7eb",
        borderHover: "#d1d5db",
      },
      dark: {
        green9: "#22c55e",
        green10: "#16a34a",
        red9: "#ef4444",
        red10: "#dc2626",
        yellow9: "#f59e0b",
        yellow10: "#d97706",
        ...darkShadows,
        shadowColor: darkShadows.shadow1,

        primary: "#f9fafb",
        primaryHover: "#f3f4f6",
        secondary: "#9ca3af",
        success: "#22c55e",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#9ca3af",

        surface: "#1f2937",
        surfaceHover: "#374151",
        surfaceActive: "#4b5563",

        textPrimary: "#f9fafb",
        textSecondary: "#d1d5db",
        textMuted: "#9ca3af",

        border: "#374151",
        borderHover: "#4b5563",
      },
    },
  },
  accent: { palette: { dark: accentBlue.dark, light: accentBlue.light } },
  childrenThemes: {
    success: {
      palette: {
        dark: [
          "#16a34a",
          "#22c55e",
          "#4ade80",
          "#86efac",
          "#bbf7d0",
          "#dcfce7",
          "#f0fdf4",
        ],
        light: [
          "#f0fdf4",
          "#dcfce7",
          "#bbf7d0",
          "#86efac",
          "#4ade80",
          "#22c55e",
          "#16a34a",
        ],
      },
    },
    error: {
      palette: {
        dark: [
          "#dc2626",
          "#ef4444",
          "#f87171",
          "#fca5a5",
          "#fecaca",
          "#fee2e2",
          "#fef2f2",
        ],
        light: [
          "#fef2f2",
          "#fee2e2",
          "#fecaca",
          "#fca5a5",
          "#f87171",
          "#ef4444",
          "#dc2626",
        ],
      },
    },
    warning: {
      palette: {
        dark: [
          "#d97706",
          "#f59e0b",
          "#fbbf24",
          "#fcd34d",
          "#fde68a",
          "#fef3c7",
          "#fffbeb",
        ],
        light: [
          "#fffbeb",
          "#fef3c7",
          "#fde68a",
          "#fcd34d",
          "#fbbf24",
          "#f59e0b",
          "#d97706",
        ],
      },
    },
  },
});

const animations = createAnimations({
  bouncy: { type: "spring", damping: 10, mass: 0.9, stiffness: 100 },
  lazy: { type: "spring", damping: 20, stiffness: 60 },
  quick: { type: "spring", damping: 20, mass: 1.2, stiffness: 250 },
});

export const config = createTamagui({
  themes,
  animations,
  shorthands,

  tokens: {
    color: {},
    space: {
      0: 0,
      0.25: 2,
      0.5: 4,
      0.75: 6,
      1: 8,
      1.5: 12,
      2: 16,
      2.5: 20,
      3: 24,
      3.5: 28,
      4: 32,
      5: 40,
      6: 48,
      7: 56,
      8: 64,
      9: 72,
      10: 80,
      12: 96,
      16: 128,
      20: 160,
      true: 8,
      false: 0,
    },
    size: {
      0: 0,
      0.25: 2,
      0.5: 4,
      0.75: 6,
      1: 8,
      1.5: 12,
      2: 16,
      2.5: 20,
      3: 24,
      3.5: 28,
      4: 32,
      5: 40,
      6: 48,
      7: 56,
      8: 64,
      9: 72,
      10: 80,
      12: 96,
      16: 128,
      20: 160,
      true: 8,
      false: 0,
    },
    radius: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, true: 8, false: 0 },
    zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 },
  },

  fonts: {
    body: {
      family: "System",
      size: {
        1: 11,
        2: 12,
        3: 14,
        4: 16,
        5: 18,
        6: 20,
        7: 24,
        8: 28,
        9: 32,
        10: 36,
        true: 16,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 24,
        5: 26,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 44,
        true: 24,
      },
      weight: { 1: "300", 2: "400", 3: "500", 4: "600", 5: "700", true: "400" },
    },
    heading: {
      family: "System",
      size: {
        1: 11,
        2: 12,
        3: 14,
        4: 16,
        5: 18,
        6: 20,
        7: 24,
        8: 28,
        9: 32,
        10: 36,
        true: 16,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 24,
        5: 26,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 44,
        true: 24,
      },
      weight: { 1: "300", 2: "400", 3: "500", 4: "600", 5: "700", true: "600" },
    },
  },

  settings: {
    allowedStyleValues: "strict",
  },
});

export type AppConfig = typeof config;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}
