import { DailyStat } from '../model/types';
import { formatDateString } from './date-utils';

/**
 * 해당 날짜의 완료율(0~1)을 반환. 통계가 없으면 0
 */
export function getDailyRate(dailyStats: DailyStat[], date: Date): number {
  const dateString = formatDateString(date);
  return dailyStats.find((stat) => stat.date === dateString)?.rate ?? 0;
}
