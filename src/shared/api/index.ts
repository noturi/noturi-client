import ky from 'ky';

import { requestInterceptor, retryInterceptor } from './interceptors';

export { ENDPOINTS } from './endpoints';

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL + '/client',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    limit: 1,
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [requestInterceptor],
    beforeRetry: [retryInterceptor],
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
