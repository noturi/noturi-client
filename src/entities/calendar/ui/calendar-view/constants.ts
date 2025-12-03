// 캘린더 테마 설정
export const CALENDAR_THEME = {
  backgroundColor: '#ffffff', // backgroundPrimary
  calendarBackground: '#ffffff', // backgroundPrimary
  textSectionTitleColor: '#9e9e9e', // textMuted
  selectedDayBackgroundColor: '#1d1d1d', // primary
  selectedDayTextColor: '#000000', // textOnAccent
  todayTextColor: '#ffc107', // accent
  dayTextColor: '#212121', // textPrimary
  textDisabledColor: '#9e9e9e', // textMuted - 지난달/다음달 날짜 회색
  textInactiveColor: '#9e9e9e', // textMuted
  dotColor: '#1d1d1d', // primary
  selectedDotColor: '#000000', // textOnAccent
  arrowColor: '#1d1d1d', // primary
  monthTextColor: '#212121', // textPrimary
  indicatorColor: '#212121', // textPrimary
  textDayFontWeight: '500' as const,
  textMonthFontWeight: '600' as const,
  textDayHeaderFontWeight: '500' as const,
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

export const CALENDAR_COLORS = {
  SELECTION: '#1d1d1d',
  SCHEDULE_LIGHT: '#007AFF', // 1개 일정 (여유)
  SCHEDULE_MODERATE: '#FFC107', // 2개 일정 (보통)
  SCHEDULE_BUSY: '#FF9800', // 3개 일정 (바쁨)
  SCHEDULE_OVERLOAD: '#FF5722', // 4개+ 일정 (과부하)
} as const;
