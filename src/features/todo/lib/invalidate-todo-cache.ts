import { QUERY_KEYS } from '~/shared/lib';

import { QueryClient } from '@tanstack/react-query';

/**
 * 투두 관련 캐시를 일괄 무효화합니다.
 * 모든 투두 mutation의 onSuccess에서 공통으로 사용됩니다.
 */
export function invalidateTodoCache(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: ['todos'],
      exact: false,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.todosWeeklyStats,
    }),
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.todosOverviewStats,
    }),
  ]);
}
