import { Alert } from 'react-native';

import { QueryClient } from '@tanstack/react-query';

import { ERROR_MESSAGES } from './errors';
import { ApiError } from './types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 5, // 5분
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      onError: (error: Error) => {
        const message = error instanceof ApiError ? error.message : ERROR_MESSAGES.DEFAULT;
        Alert.alert('오류', message);
      },
    },
  },
});
