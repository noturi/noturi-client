import { QUERY_KEYS } from '~/shared/lib';

import { QueryClient } from '@tanstack/react-query';

/**
 * 메모 변경 시 영향을 받는 캐시 무효화 (메모 목록, 카테고리, 통계 전체)
 */
export function invalidateMemoRelatedCache(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memos }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories }),
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics }),
  ]);
}
