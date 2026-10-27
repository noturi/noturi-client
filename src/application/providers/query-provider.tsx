import { queryClient } from '~/shared/api/query-client';
import { QUERY_CACHE_MAX_AGE, queryPersister } from '~/shared/api/query-persister';

import { ReactNode } from 'react';

import Constants from 'expo-constants';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

interface QueryProviderProps {
  children: ReactNode;
}

const persistOptions = {
  persister: queryPersister,
  maxAge: QUERY_CACHE_MAX_AGE,
  // 앱 버전이 바뀌면 저장된 캐시를 버림 — 응답 형태가 바뀐 이전 데이터를 복원하지 않도록
  buster: Constants.expoConfig?.version ?? '',
};

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}
