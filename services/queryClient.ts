import { Alert } from 'react-native';

import { QueryClient } from '@tanstack/react-query';

import { ERROR_MESSAGES } from './api/errors';
import { ApiError } from './api/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
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
