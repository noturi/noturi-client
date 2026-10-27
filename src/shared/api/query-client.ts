import NetInfo from '@react-native-community/netinfo';
import { HTTPError } from 'ky';

import { Alert } from 'react-native';

import { QueryClient, onlineManager } from '@tanstack/react-query';

import { ERROR_MESSAGES, getErrorBody } from './errors';
import { QUERY_CACHE_MAX_AGE } from './query-persister';

// 네트워크 상태를 React Query에 연결 — 오프라인이면 쿼리는 오류 대신 일시정지(캐시 유지), 복귀 시 재개
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      // 기기에 저장된 캐시를 복원해 쓰려면 저장 기간(maxAge) 이상이어야 함
      gcTime: QUERY_CACHE_MAX_AGE,
      retry: false,
      refetchOnWindowFocus: false,
      // 오프라인에서 복귀하면 오래된(stale) 데이터만 다시 받음
      refetchOnReconnect: true,
    },
    mutations: {
      // 오프라인이어도 일시정지하지 않고 바로 실패 — 버튼이 로딩 상태로 멈추지 않게 (오프라인 저장 큐는 미지원)
      networkMode: 'always',
      onError: async (error: Error) => {
        let message: string = ERROR_MESSAGES.DEFAULT;

        if (!onlineManager.isOnline()) {
          message = ERROR_MESSAGES.OFFLINE;
        } else if (error instanceof HTTPError) {
          const body = await getErrorBody(error);
          message = body?.message || ERROR_MESSAGES.DEFAULT;
        }

        Alert.alert('오류', message);
      },
    },
  },
});
