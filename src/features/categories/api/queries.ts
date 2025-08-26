import { CategoryListParamsDto } from '~/entities/category';
import { QUERY_KEYS } from '~/shared/lib';

import { queryOptions } from '@tanstack/react-query';

import { categoryApi } from './apis';

// 카테고리 목록 쿼리
export const categoryListQuery = (params: CategoryListParamsDto = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.categories[0], params],
    queryFn: () => categoryApi.getCategories(params),
  });

// 특정 카테고리 쿼리
export const categoryDetailQuery = (id: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.category(id),
    queryFn: () => categoryApi.getCategory(String(id)),
    enabled: !!id, // id가 있을 때만 실행
  });

// 카테고리 통계 쿼리
export const categoryStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoryStats,
    queryFn: () => categoryApi.getCategoryStats(),
  });

// 카테고리 분포 쿼리
export const categoryDistributionQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoryDistribution,
    queryFn: () => categoryApi.getCategoryDistribution(),
  });

// 사용하지 않는 카테고리 쿼리
export const unusedCategoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesUnused,
    queryFn: () => categoryApi.getUnusedCategories(),
  });

// 카테고리 검색 쿼리
export const searchCategoriesQuery = (query: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesSearch(query),
    queryFn: () => categoryApi.searchCategories(query),
    enabled: query.length > 0, // 검색어가 있을 때만 실행
  });

// 모든 카테고리 (메모 없는 것 포함) 쿼리
export const allCategoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesAll,
    queryFn: () => categoryApi.getCategories({ includeEmpty: true }),
  });

// 활성 카테고리만 (메모가 있는 것) 쿼리
export const activeCategoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesActive,
    queryFn: () => categoryApi.getCategories({ includeEmpty: false }),
  });

// 카테고리 이름 중복 확인 쿼리
export const checkCategoryExistsQuery = (name: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.categoryCheckExists(name),
    queryFn: () => categoryApi.checkCategoryExists(name),
    enabled: name.length > 0, // 이름이 있을 때만 실행
  });

// 카테고리 별 정렬 쿼리들
export const categoriesByNameQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesByName,
    queryFn: () =>
      categoryApi.getCategories({
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

export const categoriesByMemoCountQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesByMemoCount,
    queryFn: () =>
      categoryApi.getCategories({
        sortBy: 'memoCount',
        sortOrder: 'desc',
      }),
  });

export const categoriesByCreatedDateQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesByCreatedDate,
    queryFn: () =>
      categoryApi.getCategories({
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });
