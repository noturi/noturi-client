import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { memoApi } from "./apis";
import { MemoListParamsDto } from "./types";

// 메모 목록 쿼리
export const memoListQuery = (params: MemoListParamsDto = {}) =>
  queryOptions({
    queryKey: ["memos", params],
    queryFn: () => memoApi.getMemos(params),
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
  });

// 무한스크롤용 메모 목록 쿼리
export const infiniteMemoListQuery = (params: Omit<MemoListParamsDto, 'page'> = {}) =>
  infiniteQueryOptions({
    queryKey: ["memos", "infinite", params],
    queryFn: ({ pageParam = 1 }) => 
      memoApi.getMemos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
  });

// 특정 메모 쿼리
export const memoDetailQuery = (id: number) =>
  queryOptions({
    queryKey: ["memo", id],
    queryFn: () => memoApi.getMemo(id),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!id, // id가 있을 때만 실행
  });

// 카테고리 목록 쿼리
export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["memo-categories"],
    queryFn: () => memoApi.getCategories(),
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });

// 메모 검색 쿼리
export const searchMemosQuery = (query: string) =>
  queryOptions({
    queryKey: ["memos", "search", query],
    queryFn: () => memoApi.searchMemos(query),
    enabled: query.length > 0, // 검색어가 있을 때만 실행
    staleTime: 1000 * 60 * 2, // 2분
  });

// 메모 통계 쿼리
export const memoStatsQuery = () =>
  queryOptions({
    queryKey: ["memo-stats"],
    queryFn: () => memoApi.getMemoStats(),
    staleTime: 1000 * 60 * 10, // 10분
  });

// 최근 메모 쿼리 (홈 화면용)
export const recentMemosQuery = (limit: number = 5) =>
  queryOptions({
    queryKey: ["memos", "recent", limit],
    queryFn: () =>
      memoApi.getMemos({
        page: 1,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    staleTime: 1000 * 60 * 3, // 3분
  });

// 카테고리별 메모 쿼리
export const memosByCategoryQuery = (
  categoryId: string,
  params: Omit<MemoListParamsDto, "categoryId"> = {}
) =>
  queryOptions({
    queryKey: ["memos", "category", categoryId, params],
    queryFn: () => memoApi.getMemos({ ...params, categoryId }),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!categoryId, // 카테고리가 있을 때만 실행
  });
