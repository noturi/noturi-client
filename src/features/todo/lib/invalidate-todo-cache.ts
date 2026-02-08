import { QUERY_KEYS } from '~/shared/lib';

import { QueryClient } from '@tanstack/react-query';

/**
 * 투두 통계 캐시만 무효화 (weekly, overview)
 */
export function invalidateTodoStats(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todosWeeklyStats }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todosOverviewStats }),
  ]);
}

/**
 * 특정 날짜의 투두 목록 + 통계 무효화
 */
export function invalidateTodoByDate(queryClient: QueryClient, date: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todosByDate(date) }),
    invalidateTodoStats(queryClient),
  ]);
}
