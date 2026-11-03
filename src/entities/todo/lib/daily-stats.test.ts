import { DailyStat } from '../model/types';
import { getDailyRate, getStatsMonths } from './daily-stats';

describe('getDailyRate', () => {
  const stats: DailyStat[] = [
    { date: '2025-01-14', total: 4, completed: 1, rate: 0.25 },
    { date: '2025-01-15', total: 2, completed: 2, rate: 1 },
  ];

  it('같은 날짜(YYYY-MM-DD)의 rate를 반환한다', () => {
    expect(getDailyRate(stats, new Date(2025, 0, 14, 22, 30))).toBe(0.25);
    expect(getDailyRate(stats, new Date(2025, 0, 15))).toBe(1);
  });

  it('통계가 없으면 0을 반환한다', () => {
    expect(getDailyRate(stats, new Date(2025, 0, 16))).toBe(0);
    expect(getDailyRate([], new Date(2025, 0, 15))).toBe(0);
  });
});

describe('getStatsMonths', () => {
  it('이전·현재·다음 달을 반환한다', () => {
    expect(getStatsMonths(new Date(2026, 10, 2))).toEqual([
      { year: 2026, month: 10 },
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
    ]);
  });

  it('연도 경계를 넘긴다', () => {
    expect(getStatsMonths(new Date(2026, 0, 31))).toEqual([
      { year: 2025, month: 12 },
      { year: 2026, month: 1 },
      { year: 2026, month: 2 },
    ]);
  });
});
