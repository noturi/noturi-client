import { MemoListParamsDto, memoApi } from '~/entities/memo';
import { QUERY_KEYS } from '~/shared/lib';

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

// 메모 목록 쿼리
export const memoListQuery = (params: MemoListParamsDto = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.memos[0], params],
    queryFn: () => memoApi.getMemos(params),
  });

// 무한스크롤용 메모 목록 쿼리
export const infiniteMemoListQuery = (params: Omit<MemoListParamsDto, 'page'> = {}) =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.memosInfinite(params),
    queryFn: ({ pageParam = 1 }) => memoApi.getMemos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

// 특정 메모 쿼리
export const memoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.memo(id),
    queryFn: () => memoApi.getMemo(id),
    enabled: !!id, // id가 있을 때만 실행
  });

// 카테고리 목록 쿼리
export const categoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => memoApi.getCategories(),
  });

// 메모 검색 쿼리
export const searchMemosQuery = (query: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.memosSearch(query),
    queryFn: () => memoApi.searchMemos(query),
    enabled: query.length > 0, // 검색어가 있을 때만 실행
  });

// 메모 통계 쿼리
export const memoStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.statisticsMemos,
    queryFn: () => memoApi.getMemoStats(),
  });

// 최근 메모 쿼리 (홈 화면용)
export const recentMemosQuery = (limit: number = 5) =>
  queryOptions({
    queryKey: QUERY_KEYS.memosRecent(limit),
    queryFn: () =>
      memoApi.getMemos({
        page: 1,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

// 카테고리별 메모 쿼리
export const memosByCategoryQuery = (
  categoryId: string,
  params: Omit<MemoListParamsDto, 'categoryId'> = {},
) =>
  queryOptions({
    queryKey: QUERY_KEYS.memosByCategory(categoryId, params),
    queryFn: () => memoApi.getMemos({ ...params, categoryId }),
    enabled: !!categoryId, // 카테고리가 있을 때만 실행
  });