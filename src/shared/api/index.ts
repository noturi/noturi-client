import ky from 'ky';

import { afterResponseHook, beforeRequestHook } from './hooks';

export { ENDPOINTS } from './endpoints';

// API Instance
export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL + '/client',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 0,
  signal: undefined,
  hooks: {
    beforeRequest: [beforeRequestHook],
    afterResponse: [afterResponseHook],
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
