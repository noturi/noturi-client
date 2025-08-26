import { MemoListParamsDto } from '~/entities/memo';

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { memoApi } from './apis';

// 메모 목록 쿼리
export const memoListQuery = (params: MemoListParamsDto = {}) =>
  queryOptions({
    queryKey: ['memos', params],
    queryFn: () => memoApi.getMemos(params),
  });

// 무한스크롤용 메모 목록 쿼리
export const infiniteMemoListQuery = (params: Omit<MemoListParamsDto, 'page'> = {}) =>
  infiniteQueryOptions({
    queryKey: ['memos', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => memoApi.getMemos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

// 특정 메모 쿼리
export const memoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ['memo', id],
    queryFn: () => memoApi.getMemo(id),
    enabled: !!id, // id가 있을 때만 실행
  });

// 카테고리 목록 쿼리
export const categoriesQuery = () =>
  queryOptions({
    queryKey: ['memo-categories'],
    queryFn: () => memoApi.getCategories(),
  });

// 메모 검색 쿼리
export const searchMemosQuery = (query: string) =>
  queryOptions({
    queryKey: ['memos', 'search', query],
    queryFn: () => memoApi.searchMemos(query),
    enabled: query.length > 0, // 검색어가 있을 때만 실행
  });

// 메모 통계 쿼리
export const memoStatsQuery = () =>
  queryOptions({
    queryKey: ['memo-stats'],
    queryFn: () => memoApi.getMemoStats(),
  });

// 최근 메모 쿼리 (홈 화면용)
export const recentMemosQuery = (limit: number = 5) =>
  queryOptions({
    queryKey: ['memos', 'recent', limit],
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
    queryKey: ['memos', 'category', categoryId, params],
    queryFn: () => memoApi.getMemos({ ...params, categoryId }),
    enabled: !!categoryId, // 카테고리가 있을 때만 실행
  });
