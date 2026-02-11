import ky from 'ky';

import { requestInterceptor, retryInterceptor } from './interceptors';

export { ENDPOINTS } from './endpoints';

function logRequest(request: Request) {
  const method = request.method;
  const url = request.url;
  console.log(`[API] → ${method} ${url}`);
}

function logResponse(request: Request, _options: unknown, response: Response) {
  const method = request.method;
  const url = request.url;
  const status = response.status;
  console.log(`[API] ← ${status} ${method} ${url}`);
}

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
    beforeRequest: [requestInterceptor, logRequest],
    beforeRetry: [retryInterceptor],
    afterResponse: [logResponse],
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
