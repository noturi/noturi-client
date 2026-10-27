import {
  type MemoListParamsDto,
  type RatingGroupData,
  infiniteMemoListQuery,
  toUIMemos,
} from '~/entities/memo';

import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

const UNRATED = 0 as const;
const RATINGS = [5, 4, 3, 2, 1, UNRATED] as const;
const RATING_FILTERS: Record<number, Partial<MemoListParamsDto>> = {
  5: { minRating: 5, maxRating: 5 },
  4: { minRating: 4, maxRating: 4.5 },
  3: { minRating: 3, maxRating: 3.5 },
  2: { minRating: 2, maxRating: 2.5 },
  1: { minRating: 1, maxRating: 1.5 },
  [UNRATED]: { hasRating: false },
};
export const PAGE_LIMIT = 50;
export const SORT_BY = 'createdAt';
export const SORT_ORDER = 'desc';

function useRatingQuery(queryParams: Omit<MemoListParamsDto, 'page'>, rating: number) {
  return useInfiniteQuery(infiniteMemoListQuery({ ...queryParams, ...RATING_FILTERS[rating] }));
}

function buildRatingGroup(
  rating: number,
  query: ReturnType<typeof useRatingQuery>,
): RatingGroupData {
  const allMemos = query.data?.pages.flatMap((page) => page?.data || []) || [];
  const seen = new Set<string>();
  const memos = allMemos.filter((memo) => {
    if (seen.has(memo.id)) return false;
    seen.add(memo.id);
    return true;
  });

  return {
    rating,
    memos: toUIMemos(memos),
    total: query.data?.pages[0]?.total || 0,
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

export function useRatingGroups(queryParams: Omit<MemoListParamsDto, 'page'>): RatingGroupData[] {
  const r5 = useRatingQuery(queryParams, 5);
  const r4 = useRatingQuery(queryParams, 4);
  const r3 = useRatingQuery(queryParams, 3);
  const r2 = useRatingQuery(queryParams, 2);
  const r1 = useRatingQuery(queryParams, 1);
  const r0 = useRatingQuery(queryParams, UNRATED);

  return useMemo(
    () => {
      const queries = [r5, r4, r3, r2, r1, r0];
      return RATINGS.map((rating, i) => buildRatingGroup(rating, queries[i]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      r5.data,
      r5.hasNextPage,
      r5.isFetchingNextPage,
      r5.isLoading,
      r4.data,
      r4.hasNextPage,
      r4.isFetchingNextPage,
      r4.isLoading,
      r3.data,
      r3.hasNextPage,
      r3.isFetchingNextPage,
      r3.isLoading,
      r2.data,
      r2.hasNextPage,
      r2.isFetchingNextPage,
      r2.isLoading,
      r1.data,
      r1.hasNextPage,
      r1.isFetchingNextPage,
      r1.isLoading,
      r0.data,
      r0.hasNextPage,
      r0.isFetchingNextPage,
      r0.isLoading,
    ],
  );
}
