import { SCHEDULE_DENSITY_COLORS } from './colors';
import type { HexColors } from './theme';
import { FONT_SIZE } from './tokens';

// 캘린더 테마 생성 함수
export function createCalendarTheme(hexColors: HexColors) {
  return {
    backgroundColor: hexColors.surface,
    calendarBackground: hexColors.surface,
    textSectionTitleColor: hexColors.textMuted,
    selectedDayBackgroundColor: hexColors.primary,
    selectedDayTextColor: hexColors.primaryText,
    todayTextColor: hexColors.accent,
    dayTextColor: hexColors.textPrimary,
    textDisabledColor: hexColors.textMuted,
    textInactiveColor: hexColors.textMuted,
    dotColor: hexColors.primary,
    selectedDotColor: hexColors.primaryText,
    arrowColor: hexColors.textPrimary,
    monthTextColor: hexColors.textPrimary,
    indicatorColor: hexColors.textPrimary,
    textDayFontWeight: '500' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '500' as const,
    textDayFontSize: FONT_SIZE[4],
    textMonthFontSize: FONT_SIZE[5],
    textDayHeaderFontSize: FONT_SIZE[3],
  };
}

export function createCalendarColors(hexColors: HexColors) {
  return {
    SELECTION: hexColors.primary,
    SCHEDULE_LIGHT: SCHEDULE_DENSITY_COLORS.LIGHT,
    SCHEDULE_MODERATE: SCHEDULE_DENSITY_COLORS.MODERATE,
    SCHEDULE_BUSY: SCHEDULE_DENSITY_COLORS.BUSY,
    SCHEDULE_OVERLOAD: SCHEDULE_DENSITY_COLORS.OVERLOAD,
  } as const;
}
