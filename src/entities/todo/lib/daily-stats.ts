import { DailyStat, TodoMonthlyStatsParamsDto } from '../model/types';
import { formatDateString } from './date-utils';

/**
 * 해당 날짜의 완료율(0~1)을 반환. 통계가 없으면 0
 */
export function getDailyRate(dailyStats: DailyStat[], date: Date): number {
  const dateString = formatDateString(date);
  return dailyStats.find((stat) => stat.date === dateString)?.rate ?? 0;
}

/**
 * 날짜 스트립에 필요한 월간 통계 범위 — 선택 날짜가 가운데라 월 경계 근처면 앞뒤 달 날짜도 보임
 */
export function getStatsMonths(date: Date): TodoMonthlyStatsParamsDto[] {
  return [-1, 0, 1].map((offset) => {
    const month = new Date(date.getFullYear(), date.getMonth() + offset, 1);
    return { year: month.getFullYear(), month: month.getMonth() + 1 };
  });
}
