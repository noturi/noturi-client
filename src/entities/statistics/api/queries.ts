import { OverallStatsParamsDto, TrendsParamsDto } from '~/entities/statistics/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import { queryOptions } from '@tanstack/react-query';

import { statisticsApi } from './statistics-api';

// 트렌드 분석 쿼리
export const trendsQuery = (params: TrendsParamsDto = {}) =>
  queryOptions({
    queryKey: QUERY_KEYS.statisticsTrends(params),
    queryFn: () => statisticsApi.getTrends(params),
  });

// 전체 통계 쿼리
export const overallStatsQuery = (params: OverallStatsParamsDto = {}) =>
  queryOptions({
    queryKey: QUERY_KEYS.statisticsOverall(params),
    queryFn: () => statisticsApi.getOverallStats(params),
  });

// 카테고리별 통계 쿼리
export const categoryStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.statisticsCategories,
    queryFn: () => statisticsApi.getCategoryStats(),
  });
