import { createAnimations } from "@tamagui/animations-react-native";
import { createTamagui } from "@tamagui/core";
import { shorthands } from "@tamagui/shorthands";
import { createThemes, defaultComponentThemes } from "@tamagui/theme-builder";

const darkPalette = [
  "hsla(0, 0%, 8%, 1)",
  "hsla(0, 0%, 12%, 1)",
  "hsla(0, 0%, 16%, 1)",
  "hsla(0, 0%, 20%, 1)",
  "hsla(0, 0%, 28%, 1)",
  "hsla(0, 0%, 36%, 1)",
  "hsla(0, 0%, 48%, 1)",
  "hsla(0, 0%, 60%, 1)",
  "hsla(0, 0%, 72%, 1)",
  "hsla(0, 0%, 84%, 1)",
  "hsla(0, 0%, 92%, 1)",
  "hsla(0, 0%, 98%, 1)",
];

const lightPalette = [
  "hsla(0, 0%, 98%, 1)",
  "hsla(0, 0%, 95%, 1)",
  "hsla(0, 0%, 90%, 1)",
  "hsla(0, 0%, 85%, 1)",
  "hsla(0, 0%, 68%, 1)",
  "hsla(0, 0%, 56%, 1)",
  "hsla(0, 0%, 44%, 1)",
  "hsla(0, 0%, 32%, 1)",
  "hsla(0, 0%, 20%, 1)",
  "hsla(0, 0%, 12%, 1)",
  "hsla(0, 0%, 8%, 1)",
  "hsla(0, 0%, 4%, 1)",
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
  shadow1: "rgba(0,0,0,0.01)",
  shadow2: "rgba(0,0,0,0.02)",
  shadow3: "rgba(0,0,0,0.04)",
  shadow4: "rgba(0,0,0,0.06)",
  shadow5: "rgba(0,0,0,0.08)",
  shadow6: "rgba(0,0,0,0.12)",
};

const darkShadows = {
  shadow1: "rgba(0,0,0,0.12)",
  shadow2: "rgba(0,0,0,0.18)",
  shadow3: "rgba(0,0,0,0.24)",
  shadow4: "rgba(0,0,0,0.32)",
  shadow5: "rgba(0,0,0,0.40)",
  shadow6: "rgba(0,0,0,0.48)",
};

const themes = createThemes({
  componentThemes: defaultComponentThemes,
  base: {
    palette: { dark: darkPalette, light: lightPalette },
    extra: {
      light: {
        // 기본 색상 토큰 (직접 사용 금지)
        green9: "#22c55e",
        green10: "#16a34a",
        red9: "#ef4444",
        red10: "#dc2626",
        yellow9: "#f59e0b",
        yellow10: "#d97706",
        blue9: "#3b82f6",
        blue10: "#2563eb",
        ...lightShadows,
        shadowColor: lightShadows.shadow1,

        // 시맨틱 토큰 (실제 사용할 토큰들)
        primary: "#1f2937",
        primaryHover: "#374151",
        primaryActive: "#111827",

        secondary: "#6b7280",
        secondaryHover: "#4b5563",
        secondaryActive: "#374151",

        accent: "#3b82f6",
        accentHover: "#2563eb",
        accentActive: "#1d4ed8",

        success: "#22c55e",
        successHover: "#16a34a",
        successActive: "#15803d",

        error: "#ef4444",
        errorHover: "#dc2626",
        errorActive: "#b91c1c",

        warning: "#f59e0b",
        warningHover: "#d97706",
        warningActive: "#b45309",

        info: "#6b7280",
        infoHover: "#4b5563",
        infoActive: "#374151",

        surface: "#ffffff",
        surfaceHover: "#f9fafb",
        surfaceActive: "#f3f4f6",
        surfaceDisabled: "#f3f4f6",

        textPrimary: "#111827",
        textSecondary: "#6b7280",
        textMuted: "#9ca3af",
        textDisabled: "#d1d5db",
        textInverse: "#ffffff",
        textOnPrimary: "#ffffff",
        textOnAccent: "#ffffff",
        textOnSuccess: "#ffffff",
        textOnError: "#ffffff",
        textOnWarning: "#1f2937",

        border: "#e5e7eb",
        borderHover: "#d1d5db",
        borderActive: "#9ca3af",
        borderDisabled: "#f3f4f6",
        borderFocus: "#3b82f6",
        borderError: "#ef4444",
        borderWarning: "#f59e0b",
        borderSuccess: "#22c55e",

        backgroundPrimary: "#ffffff",
        backgroundSecondary: "#f9fafb",
        backgroundTertiary: "#f3f4f6",
        backgroundOverlay: "rgba(0, 0, 0, 0.5)",
      },
      dark: {
        // 기본 색상 토큰 (직접 사용 금지)
        green9: "#22c55e",
        green10: "#16a34a",
        red9: "#ef4444",
        red10: "#dc2626",
        yellow9: "#f59e0b",
        yellow10: "#d97706",
        blue9: "#60a5fa",
        blue10: "#3b82f6",
        ...darkShadows,
        shadowColor: darkShadows.shadow1,

        // 시맨틱 토큰 (실제 사용할 토큰들)
        primary: "#f9fafb",
        primaryHover: "#f3f4f6",
        primaryActive: "#e5e7eb",

        secondary: "#9ca3af",
        secondaryHover: "#d1d5db",
        secondaryActive: "#e5e7eb",

        accent: "#60a5fa",
        accentHover: "#93c5fd",
        accentActive: "#dbeafe",

        success: "#22c55e",
        successHover: "#16a34a",
        successActive: "#15803d",

        error: "#ef4444",
        errorHover: "#dc2626",
        errorActive: "#b91c1c",

        warning: "#f59e0b",
        warningHover: "#d97706",
        warningActive: "#b45309",

        info: "#9ca3af",
        infoHover: "#d1d5db",
        infoActive: "#e5e7eb",

        surface: "#1f2937",
        surfaceHover: "#374151",
        surfaceActive: "#4b5563",
        surfaceDisabled: "#374151",

        textPrimary: "#f9fafb",
        textSecondary: "#d1d5db",
        textMuted: "#9ca3af",
        textDisabled: "#6b7280",
        textInverse: "#111827",
        textOnPrimary: "#111827",
        textOnAccent: "#111827",
        textOnSuccess: "#ffffff",
        textOnError: "#ffffff",
        textOnWarning: "#111827",

        border: "#374151",
        borderHover: "#4b5563",
        borderActive: "#6b7280",
        borderDisabled: "#374151",
        borderFocus: "#60a5fa",
        borderError: "#ef4444",
        borderWarning: "#f59e0b",
        borderSuccess: "#22c55e",

        backgroundPrimary: "#111827",
        backgroundSecondary: "#1f2937",
        backgroundTertiary: "#374151",
        backgroundOverlay: "rgba(0, 0, 0, 0.8)",
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
      0.25: 1,
      0.5: 2,
      0.75: 3,
      1: 4,
      1.5: 6,
      2: 8,
      2.5: 12,
      3: 16,
      3.5: 20,
      4: 24,
      5: 32,
      6: 40,
      7: 48,
      8: 56,
      9: 64,
      10: 72,
      12: 88,
      16: 120,
      20: 150,
      true: 4,
      false: 0,
    },
    size: {
      0: 0,
      0.25: 1,
      0.5: 2,
      0.75: 3,
      1: 4,
      1.5: 6,
      2: 8,
      2.5: 12,
      3: 16,
      3.5: 20,
      4: 24,
      5: 32,
      6: 40,
      7: 48,
      8: 56,
      9: 64,
      10: 72,
      12: 88,
      16: 120,
      20: 150,
      true: 4,
      false: 0,
    },
    radius: {
      0: 0,
      1: 2,
      2: 4,
      3: 6,
      4: 8,
      5: 12,
      6: 16,
      true: 4,
      false: 0,
    },
    zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 },
  },

  fonts: {
    body: {
      family: "System",
      size: {
        1: 10,
        2: 11,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 28,
        10: 32,
        true: 14,
      },
      lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        true: 20,
      },
      weight: { 1: "300", 2: "400", 3: "500", 4: "600", 5: "700", true: "400" },
    },
    heading: {
      family: "System",
      size: {
        1: 10,
        2: 11,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 28,
        10: 32,
        true: 16,
      },
      lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 26,
        8: 30,
        9: 34,
        10: 38,
        true: 22,
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
