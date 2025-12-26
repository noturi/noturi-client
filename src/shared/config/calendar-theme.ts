import type { HexColors } from '~/features/theme/model/theme-store';

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
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };
}

export function createCalendarColors(hexColors: HexColors) {
  return {
    SELECTION: hexColors.primary,
    SCHEDULE_LIGHT: '#007AFF', // 1개 일정 (여유)
    SCHEDULE_MODERATE: '#FFC107', // 2개 일정 (보통)
    SCHEDULE_BUSY: '#FF9800', // 3개 일정 (바쁨)
    SCHEDULE_OVERLOAD: '#FF5722', // 4개+ 일정 (과부하)
  } as const;
}
