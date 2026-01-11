// Display names for debugging
export const DISPLAY_NAME = {
  ROOT: 'PressableFeedback',
  HIGHLIGHT: 'PressableFeedback.Highlight',
  RIPPLE: 'PressableFeedback.Ripple',
} as const;

// Ripple animation durations (ms)
export const BASE_RIPPLE_PROGRESS_DURATION = 1000;
export const BASE_RIPPLE_PROGRESS_DURATION_MIN = 750;

// Default scale value for press animation
export const DEFAULT_SCALE_VALUE = 0.985;

// Default opacity values
export const DEFAULT_HIGHLIGHT_OPACITY: [number, number] = [0, 0.1];
export const DEFAULT_RIPPLE_OPACITY: [number, number, number] = [0, 0.15, 0];
export const DEFAULT_RIPPLE_SCALE: [number, number, number] = [0, 1, 1];
