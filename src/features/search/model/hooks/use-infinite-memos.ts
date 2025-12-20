import { type MemoListResponseDto, memoApi } from '~/entities/memo';

import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

interface Params {
  debouncedSearchText: string;
  selectedCategoryId: string | undefined;
  selectedYear: number | undefined;
  selectedRating: number | undefined;
  enabled: boolean;
}

export function useInfiniteMemos({
  debouncedSearchText,
  selectedCategoryId,
  selectedYear,
  selectedRating,
  enabled,
}: Params) {
  return useInfiniteQuery<
    MemoListResponseDto,
    Error,
    InfiniteData<MemoListResponseDto>,
    [string, string, string, string, string, string],
    number
  >({
    queryKey: [
      'memos',
      'search',
      debouncedSearchText,
      selectedCategoryId ?? '',
      selectedYear?.toString() ?? '',
      selectedRating?.toString() ?? '',
    ],
    queryFn: ({ pageParam }) =>
      memoApi.getMemos({
        page: pageParam,
        limit: 20,
        keyword: debouncedSearchText || undefined,
        categoryId: selectedCategoryId,
        year: selectedYear,
        rating: selectedRating,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      return lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined;
    },
    enabled,
  });
}
