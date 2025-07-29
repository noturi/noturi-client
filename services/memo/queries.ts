import { queryOptions } from "@tanstack/react-query";
import { memoApi } from "./apis";
import { MemoListParamsDto } from "./types";

// 메모 목록 쿼리
export const memoListQuery = (params: MemoListParamsDto = {}) =>
  queryOptions({
    queryKey: ["memos", params],
    queryFn: () => memoApi.getMemos(params),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
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
    queryFn: () => memoApi.getMemos({ 
      page: 1, 
      limit, 
      sort: "latest" 
    }),
    staleTime: 1000 * 60 * 3, // 3분
  });

// 카테고리별 메모 쿼리
export const memosByCategoryQuery = (category: string, params: Omit<MemoListParamsDto, 'category'> = {}) =>
  queryOptions({
    queryKey: ["memos", "category", category, params],
    queryFn: () => memoApi.getMemos({ ...params, category }),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!category, // 카테고리가 있을 때만 실행
  });