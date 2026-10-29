import type { MemoListParamsDto } from '../model/types';

/** 별점 없음 그룹 */
export const UNRATED = 0;

/** 별점 최댓값 — 서버가 maxRating 5 초과를 거부함 */
const MAX_RATING = 5;

/** 별점 그룹(5~1, 0 = 별점 없음) → 목록 조회 필터. N점 그룹은 N.0~N.5 (0.5 단위) */
export function ratingGroupFilter(rating: number): Partial<MemoListParamsDto> {
  if (rating === UNRATED) return { hasRating: false };
  return { minRating: rating, maxRating: Math.min(rating + 0.5, MAX_RATING) };
}
