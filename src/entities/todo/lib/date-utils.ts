import { addDays, addWeeks, format, isSameDay, startOfWeek, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 주어진 날짜가 속한 주의 시작일(월요일)을 반환
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 월요일 시작
}

/**
 * 주 시작일로부터 7일간의 날짜 배열 반환
 */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * Date를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 요일 인덱스(0=일, 1=월, ...)를 한글 요일로 변환
 */
export function getDayLabel(dayOfWeek: number): string {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return labels[dayOfWeek] ?? '';
}

/**
 * 이전 주로 이동
 */
export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1);
}

/**
 * 다음 주로 이동
 */
export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

/**
 * 년월 포맷 (예: 2025년 1월)
 */
export function formatYearMonth(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko });
}

/**
 * 월일 요일 포맷 (예: 1월 25일 토요일)
 */
export function formatDateWithDay(date: Date): string {
  return format(date, 'M월 d일 EEEE', { locale: ko });
}

/**
 * 기준일 앞뒤로 daysEachSide일씩, 총 (2 * daysEachSide + 1)일의 날짜 배열 반환
 * (기준일의 시각은 그대로 유지)
 */
export function getDateRange(center: Date, daysEachSide: number): Date[] {
  return Array.from({ length: daysEachSide * 2 + 1 }, (_, i) => addDays(center, i - daysEachSide));
}

/**
 * 날짜 배열에서 target과 같은 날의 인덱스 반환 (없으면 -1)
 */
export function findSameDayIndex(dates: Date[], target: Date): number {
  return dates.findIndex((date) => isSameDay(date, target));
}

/**
 * YYYY-MM-DD 문자열을 로컬 자정 기준 Date로 변환
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}
