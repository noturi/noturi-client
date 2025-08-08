import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { type MemoListResponseDto, memoApi } from '@/services/memo';

interface Params {
  debouncedSearchText: string;
  selectedCategoryIds: string[];
  selectedRating: number | undefined;
  enabled: boolean;
}

export function useInfiniteMemos({
  debouncedSearchText,
  selectedCategoryIds,
  selectedRating,
  enabled,
}: Params) {
  return useInfiniteQuery<
    MemoListResponseDto,
    Error,
    InfiniteData<MemoListResponseDto>,
    [string, string, string, string, string],
    number
  >({
    queryKey: [
      'memos',
      'search',
      debouncedSearchText,
      selectedCategoryIds.sort().join(','),
      selectedRating?.toString() ?? '',
    ],
    queryFn: ({ pageParam }) =>
      memoApi.getMemos({
        page: pageParam,
        limit: 20,
        search: debouncedSearchText || undefined,
        categoryIds: selectedCategoryIds,
        rating: selectedRating,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled,
  });
}
