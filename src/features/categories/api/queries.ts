import { QUERY_KEYS } from '~/shared/lib';

import { queryOptions } from '@tanstack/react-query';

import { categoryApi } from './apis';

// 카테고리 통계 쿼리
export const categoryStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.statisticsCategories,
    queryFn: () => categoryApi.getCategoryStats(),
  });

// 활성 카테고리만 (메모가 있는 것) 쿼리
export const activeCategoriesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.categoriesActive,
    queryFn: () => categoryApi.getCategories({ includeEmpty: false }),
  });
