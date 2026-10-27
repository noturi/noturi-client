import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

/** 저장된 쿼리 캐시 유효 기간 — 오프라인으로 앱을 열어도 마지막 데이터를 보여주기 위함 (gcTime과 같아야 함) */
export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24시간

/** 쿼리 캐시를 기기에 저장 — 로그아웃 시 `queryPersister.removeClient()`로 함께 삭제 */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'noturi-query-cache',
});
