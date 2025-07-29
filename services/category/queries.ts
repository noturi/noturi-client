import { queryOptions } from "@tanstack/react-query";
import { categoryApi } from "./apis";
import { CategoryListParamsDto } from "./types";

// 카테고리 목록 쿼리
export const categoryListQuery = (params: CategoryListParamsDto = {}) =>
  queryOptions({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
  });

// 특정 카테고리 쿼리
export const categoryDetailQuery = (id: number) =>
  queryOptions({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getCategory(id),
    staleTime: 1000 * 60 * 10, // 10분
    enabled: !!id, // id가 있을 때만 실행
  });

// 카테고리 통계 쿼리
export const categoryStatsQuery = () =>
  queryOptions({
    queryKey: ["category-stats"],
    queryFn: () => categoryApi.getCategoryStats(),
    staleTime: 1000 * 60 * 5, // 5분
  });

// 카테고리 분포 쿼리
export const categoryDistributionQuery = () =>
  queryOptions({
    queryKey: ["category-distribution"],
    queryFn: () => categoryApi.getCategoryDistribution(),
    staleTime: 1000 * 60 * 5, // 5분
  });

// 사용하지 않는 카테고리 쿼리
export const unusedCategoriesQuery = () =>
  queryOptions({
    queryKey: ["categories", "unused"],
    queryFn: () => categoryApi.getUnusedCategories(),
    staleTime: 1000 * 60 * 15, // 15분
  });

// 카테고리 검색 쿼리
export const searchCategoriesQuery = (query: string) =>
  queryOptions({
    queryKey: ["categories", "search", query],
    queryFn: () => categoryApi.searchCategories(query),
    enabled: query.length > 0, // 검색어가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
  });

// 모든 카테고리 (메모 없는 것 포함) 쿼리
export const allCategoriesQuery = () =>
  queryOptions({
    queryKey: ["categories", "all"],
    queryFn: () => categoryApi.getCategories({ includeEmpty: true }),
    staleTime: 1000 * 60 * 10, // 10분
  });

// 활성 카테고리만 (메모가 있는 것) 쿼리
export const activeCategoriesQuery = () =>
  queryOptions({
    queryKey: ["categories", "active"],
    queryFn: () => categoryApi.getCategories({ includeEmpty: false }),
    staleTime: 1000 * 60 * 5, // 5분
  });

// 카테고리 이름 중복 확인 쿼리
export const checkCategoryExistsQuery = (name: string) =>
  queryOptions({
    queryKey: ["category", "check-exists", name],
    queryFn: () => categoryApi.checkCategoryExists(name),
    enabled: name.length > 0, // 이름이 있을 때만 실행
    staleTime: 1000 * 60 * 2, // 2분
  });

// 카테고리 별 정렬 쿼리들
export const categoriesByNameQuery = () =>
  queryOptions({
    queryKey: ["categories", "sorted", "name"],
    queryFn: () => categoryApi.getCategories({ 
      sortBy: "name", 
      sortOrder: "asc" 
    }),
    staleTime: 1000 * 60 * 10, // 10분
  });

export const categoriesByMemoCountQuery = () =>
  queryOptions({
    queryKey: ["categories", "sorted", "memoCount"],
    queryFn: () => categoryApi.getCategories({ 
      sortBy: "memoCount", 
      sortOrder: "desc" 
    }),
    staleTime: 1000 * 60 * 5, // 5분
  });

export const categoriesByCreatedDateQuery = () =>
  queryOptions({
    queryKey: ["categories", "sorted", "createdAt"],
    queryFn: () => categoryApi.getCategories({ 
      sortBy: "createdAt", 
      sortOrder: "desc" 
    }),
    staleTime: 1000 * 60 * 10, // 10분
  });