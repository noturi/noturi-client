import { OverallStatsParamsDto, TrendsParamsDto } from '~/entities/statistics';

import { queryOptions } from '@tanstack/react-query';

import { statisticsApi } from './apis';

// 트렌드 분석 쿼리
export const trendsQuery = (params: TrendsParamsDto = {}) =>
  queryOptions({
    queryKey: ['statistics', 'trends', params],
    queryFn: () => statisticsApi.getTrends(params),
  });

// 전체 통계 쿼리
export const overallStatsQuery = (params: OverallStatsParamsDto = {}) =>
  queryOptions({
    queryKey: ['statistics', 'overall', params],
    queryFn: () => statisticsApi.getOverallStats(params),
  });

// 카테고리별 통계 쿼리
export const categoryStatsQuery = () =>
  queryOptions({
    queryKey: ['statistics', 'categories'],
    queryFn: () => statisticsApi.getCategoryStats(),
  });
