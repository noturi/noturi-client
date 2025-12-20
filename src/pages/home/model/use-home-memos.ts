import { type MemoViewType, type UIMemo, infiniteMemoListQuery } from '~/entities/memo';
import { MemoService } from '~/features/memo/model';

import { useMemo } from 'react';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface UseHomeMemosParams {
  selectedView: MemoViewType;
  selectedCategoryId: string | undefined;
  selectedYear: number | undefined;
}

export function useHomeMemos({
  selectedView,
  selectedCategoryId,
  selectedYear,
}: UseHomeMemosParams) {
  const queryParams = useMemo(
    () => ({
      limit: 20,
      categoryId: selectedView === 'rating' ? selectedCategoryId : undefined,
      year: selectedView === 'rating' ? selectedYear : undefined,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }),
    [selectedView, selectedCategoryId, selectedYear],
  );

  const { data } = useSuspenseInfiniteQuery(infiniteMemoListQuery(queryParams));

  const memos: UIMemo[] = useMemo(() => {
    if (!data?.pages) return [];
    const allMemos = data.pages.flatMap((page) => page?.data || []);
    return MemoService.transformToUIMemos(allMemos);
  }, [data]);

  return { memos };
}
