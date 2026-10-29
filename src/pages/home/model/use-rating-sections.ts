import { type RatingSummaryParamsDto, ratingSummaryQuery, toUIMemos } from '~/entities/memo';
import type { RatingSection } from '~/widgets';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

/** 별점 구역마다 보여줄 최근 메모 수 — 나머지는 "전체" 화면에서 */
export const SECTION_PREVIEW_LIMIT = 5;

/** 홈 별점 구역 — 요청 한 번으로 모든 별점의 개수와 최근 메모를 받는다 */
export function useRatingSections(params: Omit<RatingSummaryParamsDto, 'limit'>) {
  const query = useQuery({
    ...ratingSummaryQuery({ ...params, limit: SECTION_PREVIEW_LIMIT }),
    // 카테고리·연도를 바꾸는 동안 이전 목록을 유지해 화면이 비었다 채워지며 깜빡이지 않게
    placeholderData: keepPreviousData,
  });

  const sections: RatingSection[] = (query.data?.groups ?? []).map((group) => ({
    rating: group.rating,
    total: group.total,
    memos: toUIMemos(group.memos),
  }));

  return { sections, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
