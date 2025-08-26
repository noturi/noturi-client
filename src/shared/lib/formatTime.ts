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
