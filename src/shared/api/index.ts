import ky from 'ky';

import { afterResponseHook, beforeRequestHook, beforeRetryHook } from './hooks';

export { ENDPOINTS } from './endpoints';

// API Instance
export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL + '/client',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    limit: 1,
    statusCodes: [401], // 401일 때만 재시도
  },
  hooks: {
    beforeRequest: [beforeRequestHook],
    afterResponse: [afterResponseHook],
    beforeRetry: [beforeRetryHook],
  },
});

export function toSearchParams<T extends object>(
  params: T,
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  ) as Record<string, string | number | boolean>;
}
