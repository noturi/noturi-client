import {
  formatDateString,
  formatDateWithDay,
  getDayLabel,
  getWeekDates,
  getWeekStart,
} from './date-utils';

describe('date-utils', () => {
  it('getWeekStart: 월요일 시작', () => {
    // 2026-06-14는 일요일 → 해당 주 월요일은 06-08
    expect(formatDateString(getWeekStart(new Date(2026, 5, 14)))).toBe('2026-06-08');
    expect(formatDateString(getWeekStart(new Date(2026, 5, 8)))).toBe('2026-06-08');
  });

  it('getWeekDates: 7일 연속', () => {
    const dates = getWeekDates(new Date(2026, 5, 8)).map(formatDateString);
    expect(dates).toEqual([
      '2026-06-08',
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
    ]);
  });

  it('getDayLabel: 범위 밖은 빈 문자열', () => {
    expect(getDayLabel(0)).toBe('일');
    expect(getDayLabel(6)).toBe('토');
    expect(getDayLabel(7)).toBe('');
  });

  it('formatDateWithDay: 한글 요일 포함', () => {
    expect(formatDateWithDay(new Date(2026, 5, 13))).toBe('6월 13일 토요일');
  });
});
