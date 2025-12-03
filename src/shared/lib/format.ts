// 시간 관련 상수
export const MS_PER_MINUTE = 1000 * 60;
export const MS_PER_HOUR = MS_PER_MINUTE * 60;
export const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * 현재 시간으로부터 N시간 후의 Date 반환
 */
export function getHoursLater(hours: number = 1): Date {
  return new Date(Date.now() + MS_PER_HOUR * hours);
}

// 로케일 상수
const DEFAULT_LOCALE = 'ko-KR';

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param input Date 객체 또는 ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025년 12월 3일 (화)")
 */
export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

/**
 * 시간을 24시간 형식으로 포맷팅
 * @param input Date 객체 또는 ISO 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "14:30")
 */
export function formatTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleTimeString(DEFAULT_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * 날짜를 상대적 시간으로 변환
 * @param input Date 객체 또는 ISO 날짜 문자열
 * @returns 상대적 시간 문자열 (예: "방금 전", "3분 전", "2시간 전")
 */
export function formatTimeAgo(input: string | Date): string {
  const now = new Date();
  const date = typeof input === 'string' ? new Date(input) : input;

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / MS_PER_MINUTE);
  const diffInHours = Math.floor(diffInMs / MS_PER_HOUR);
  const diffInDays = Math.floor(diffInMs / MS_PER_DAY);

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInHours < 1) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString(DEFAULT_LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

/**
 * 절대 시간 포맷팅
 * @param input Date 객체 또는 ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025-01-15 14:30")
 */
export function formatAbsoluteTime(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 12시간 형식(AM/PM)을 24시간 형식으로 변환
 * @param hour 시간 (1-12)
 * @param minute 분 (00-59)
 * @param ampm AM 또는 PM
 * @returns 24시간 형식 시간 문자열 (예: "09:30", "14:15")
 */
export function convertTo24Hour(hour: string, minute: string, ampm: string): string {
  let hour24 = parseInt(hour);
  if (ampm === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (ampm === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

/**
 * 24시간 형식을 12시간 형식(AM/PM)으로 변환
 * @param time24 24시간 형식 시간 문자열 (예: "14:30")
 * @returns 12시간 형식 객체 { hour: "02", minute: "30", ampm: "PM" }
 */
export function convertTo12Hour(time24: string): { hour: string; minute: string; ampm: string } {
  const [hourStr, minute] = time24.split(':');
  const hour24 = parseInt(hourStr);

  const ampm = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 || 12;

  return {
    hour: hour12.toString().padStart(2, '0'),
    minute,
    ampm,
  };
}

/**
 * 시간 선택 옵션 상수들
 */

/** 시간 옵션 (1-12시) */
export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return { value: hour.toString().padStart(2, '0'), label: `${hour}시` };
});

/** 분 옵션 (5분 단위) */
export const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const minute = i * 5;
  return { value: minute.toString().padStart(2, '0'), label: `${minute}분` };
});

/** AM/PM 옵션 */
export const AM_PM_OPTIONS = [
  { value: 'AM', label: '오전' },
  { value: 'PM', label: '오후' },
] as const;
