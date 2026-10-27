import {
  findSameDayIndex,
  formatDateString,
  formatDateWithDay,
  getDateRange,
  getDayLabel,
  getWeekDates,
  getWeekStart,
  parseDateString,
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

describe('getDateRange', () => {
  const center = new Date(2025, 0, 15, 13, 45);

  it('기준일 앞뒤로 daysEachSide일씩 총 2n+1일을 반환한다 (시각 유지)', () => {
    const range = getDateRange(center, 3);

    expect(range).toHaveLength(7);
    expect(range[0]).toEqual(new Date(2025, 0, 12, 13, 45));
    expect(range[3]).toEqual(center);
    expect(range[6]).toEqual(new Date(2025, 0, 18, 13, 45));
  });

  it('월/연 경계를 넘어 연속된 날짜를 만든다', () => {
    const range = getDateRange(new Date(2024, 11, 31), 1).map(formatDateString);
    expect(range).toEqual(['2024-12-30', '2024-12-31', '2025-01-01']);
  });

  it('daysEachSide가 0이면 기준일만 반환한다', () => {
    expect(getDateRange(center, 0)).toEqual([center]);
  });
});

describe('findSameDayIndex', () => {
  const dates = getDateRange(new Date(2025, 0, 15, 9), 2);

  it('시각과 무관하게 같은 날의 인덱스를 반환한다', () => {
    expect(findSameDayIndex(dates, new Date(2025, 0, 16, 23, 59))).toBe(3);
    expect(findSameDayIndex(dates, new Date(2025, 0, 13, 0, 0))).toBe(0);
  });

  it('범위 밖이면 -1을 반환한다', () => {
    expect(findSameDayIndex(dates, new Date(2025, 0, 18))).toBe(-1);
  });
});

describe('parseDateString', () => {
  it('YYYY-MM-DD를 로컬 자정 Date로 변환한다', () => {
    expect(parseDateString('2025-03-09')).toEqual(new Date(2025, 2, 9));
  });

  it('윤년 2월 29일을 처리한다', () => {
    expect(formatDateString(parseDateString('2024-02-29'))).toBe('2024-02-29');
  });
});
