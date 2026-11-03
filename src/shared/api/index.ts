import ky from 'ky';
import Logger from '~/shared/lib/logger';

import { requestInterceptor, retryInterceptor } from './interceptors';
import { captureApiResponse } from './sentry-capture';

export { ENDPOINTS } from './endpoints';

// 정상 요청/응답 로그는 EXPO_PUBLIC_LOG_API=1일 때만 출력 (기본은 조용히)
// 실패 응답(4xx/5xx)은 Sentry 정책(sentry-policy.ts)에 따라 이슈 또는 breadcrumb로 기록
const LOG_ALL_API = process.env.EXPO_PUBLIC_LOG_API === '1';

function logRequest(request: Request) {
  if (!LOG_ALL_API) return;
  Logger.debug(`[API] → ${request.method} ${request.url}`);
}

function logResponse(request: Request, _options: unknown, response: Response) {
  if (!response.ok) {
    void captureApiResponse(request, response);
    return;
  }
  if (!LOG_ALL_API) return;
  Logger.debug(`[API] ← ${response.status} ${request.method} ${request.url}`);
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
export { parseResponse } from './parse-response';
