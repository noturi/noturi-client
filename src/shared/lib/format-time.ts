/**
 * 시간 포맷팅 유틸리티 함수
 */

/**
 * ISO 날짜 문자열을 상대적 시간으로 변환
 * @param dateString ISO 날짜 문자열
 * @returns 상대적 시간 문자열 (예: "방금 전", "3분 전", "2시간 전")
 */
export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInHours < 1) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

/**
 * 절대 시간 포맷팅
 * @param dateString ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025-01-15 14:30")
 */
export function formatAbsoluteTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
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
 * @returns 12시간 형식 객체 { hour: "2", minute: "30", ampm: "PM" }
 */
export function convertTo12Hour(time24: string): { hour: string; minute: string; ampm: string } {
  const [hourStr, minute] = time24.split(':');
  const hour24 = parseInt(hourStr);

  let hour12: number;
  let ampm: string;

  if (hour24 === 0) {
    hour12 = 12;
    ampm = 'AM';
  } else if (hour24 < 12) {
    hour12 = hour24;
    ampm = 'AM';
  } else if (hour24 === 12) {
    hour12 = 12;
    ampm = 'PM';
  } else {
    hour12 = hour24 - 12;
    ampm = 'PM';
  }

  return {
    hour: hour12.toString().padStart(2, '0'),
    minute,
    ampm,
  };
}

/**
 * 시간 선택 옵션 생성 유틸리티
 */
export const timeSelectOptions = {
  /**
   * 시간 옵션 생성 (1-12시)
   */
  getHourOptions: () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      return { value: hour.toString().padStart(2, '0'), label: `${hour}시` };
    });
  },

  /**
   * 분 옵션 생성 (5분 단위)
   */
  getMinuteOptions: () => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = i * 5;
      return { value: minute.toString().padStart(2, '0'), label: `${minute}분` };
    });
  },

  /**
   * AM/PM 옵션 생성
   */
  getAmPmOptions: () => [
    { value: 'AM', label: '오전' },
    { value: 'PM', label: '오후' },
  ],
};
