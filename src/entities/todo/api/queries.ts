import { QUERY_KEYS } from '~/shared/lib';

import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { TodoListParamsDto, TodoMonthlyStatsParamsDto } from '../model/types';
import { todoApi } from './apis';

// 투두 목록 쿼리
export const todoListQuery = (params: TodoListParamsDto = {}) =>
  queryOptions({
    queryKey: QUERY_KEYS.todos(params),
    queryFn: () => todoApi.getTodos(params),
  });

// 특정 날짜 투두 쿼리
export const todosByDateQuery = (date: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.todosByDate(date),
    queryFn: () => todoApi.getTodos({ date }),
    enabled: !!date,
    placeholderData: keepPreviousData,
  });

// 월간 통계 쿼리
export const todoMonthlyStatsQuery = (params: TodoMonthlyStatsParamsDto) =>
  queryOptions({
    queryKey: QUERY_KEYS.todosMonthlyStats(params),
    queryFn: () => todoApi.getMonthlyStats(params),
  });

// 주간 통계 쿼리
export const todoWeeklyStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.todosWeeklyStats,
    queryFn: () => todoApi.getWeeklyStats(),
  });

// 전체 통계 개요 쿼리
export const todoOverviewStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.todosOverviewStats,
    queryFn: () => todoApi.getOverviewStats(),
  });

// 잔디 차트 통계 쿼리
export const todoGrassStatsQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.todosGrassStats,
    queryFn: () => todoApi.getGrassStats(),
  });

// 반복 템플릿 목록 쿼리
export const todoTemplatesQuery = () =>
  queryOptions({
    queryKey: QUERY_KEYS.todosTemplates,
    queryFn: () => todoApi.getTemplates(),
  });
