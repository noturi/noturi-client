import ky from 'ky';

import { afterResponseHook, beforeRequestHook } from './hooks';

// API Instance
export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL,
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
