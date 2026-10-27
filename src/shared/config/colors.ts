/**
 * 테마와 무관한 고정 색상 상수
 *
 * 테마에 따라 달라져야 하는 색상은 여기가 아니라 theme.ts 프리셋에 토큰으로 추가하고
 * className(`text-text-muted`) 또는 `useThemeColor('textMuted')`로 사용한다.
 */

// 새 카테고리 기본 색상
export const DEFAULT_COLORS = '#000000';

// 카테고리가 없는 메모의 '기타' 카테고리 색상 (gray-500)
export const FALLBACK_CATEGORY_COLOR = '#6b7280';

// 그림자 색상 (iOS shadowColor — 테마 공통)
export const SHADOW_COLOR = '#000';

// 별점 별 색상 (다크/라이트 모드 공통, accent와 동일)
export const STAR_COLOR = '#ffc107';

// 별점 입력(RatingSelector)·별점 필터 칩 색상
export const RATING_INPUT_FILLED_COLOR = '#f59e0b';
export const RATING_INPUT_EMPTY_COLOR = '#fef3c7';

// 캘린더 일정 밀도 색상 (데이터 표현용 — 테마와 무관)
export const SCHEDULE_DENSITY_COLORS = {
  LIGHT: '#007AFF', // 1개 일정 (여유)
  MODERATE: '#FFC107', // 2개 일정 (보통)
  BUSY: '#FF9800', // 3개 일정 (바쁨)
  OVERLOAD: '#FF5722', // 4개+ 일정 (과부하)
} as const;
