import { DailyStat } from '../model/types';
import { getDailyRate } from './daily-stats';

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
