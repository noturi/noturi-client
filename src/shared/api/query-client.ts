import { HTTPError } from 'ky';

import { Alert } from 'react-native';

import { QueryClient } from '@tanstack/react-query';

import { ERROR_MESSAGES, getErrorBody } from './errors';

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
      onError: async (error: Error) => {
        let message: string = ERROR_MESSAGES.DEFAULT;

        if (error instanceof HTTPError) {
          const body = await getErrorBody(error);
          message = body?.message || ERROR_MESSAGES.DEFAULT;
        }

        Alert.alert('오류', message);
      },
    },
  },
});
