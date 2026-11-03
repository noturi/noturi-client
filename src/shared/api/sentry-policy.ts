import { ERROR_CODE_MESSAGES } from './errors';

/**
 * Sentry 에러 정책 — "고칠 책임이 있는 쪽이 이슈로 받는다"
 *
 * | 에러                         | 앱 Sentry           | 이유                                      |
 * | ---------------------------- | ------------------- | ----------------------------------------- |
 * | 네트워크 끊김·타임아웃       | 버림 (beforeSend)   | 사용자 환경                               |
 * | 401                          | breadcrumb (info)   | 토큰 갱신 후 재시도하는 정상 흐름         |
 * | 5xx                          | breadcrumb (error)  | 서버 Sentry가 이슈로 받음 (중복 방지)     |
 * | 처리된 비즈니스 4xx          | breadcrumb (warning)| 앱이 안내 문구로 처리 중 (SKIP_API_ERRORS)|
 * | 그 밖의 4xx                  | 이슈 (error)        | 앱 버그·구버전 앱과 서버 계약 불일치      |
 *
 * 4xx는 기본으로 모두 이슈 — "처리 중"이 확인된 응답만 SKIP_API_ERRORS에 추가한다.
 * (화이트리스트로 두면 새 API의 4xx가 아무 데도 기록되지 않는다)
 */

export interface ApiErrorInfo {
  status: number;
  method: string;
  path: string;
  /** 서버 비즈니스 에러 코드 (예: 4091) */
  code?: number;
}

export type ApiErrorAction = 'issue' | 'breadcrumb';

type SkipApiErrorMatcher = (error: ApiErrorInfo) => boolean;

/** 앱이 이미 처리하고 있는 4xx — 이슈 대신 breadcrumb로만 남김 */
const SKIP_API_ERRORS: SkipApiErrorMatcher[] = [
  // 토큰 만료 → interceptors의 retryInterceptor가 갱신 후 재시도
  ({ status }) => status === 401,
  // 안내 문구가 정해진 비즈니스 에러 (중복 카테고리, 메모가 있는 카테고리 삭제 등)
  ({ code }) => code != null && code in ERROR_CODE_MESSAGES,
];

export function classifyApiError(error: ApiErrorInfo): {
  action: ApiErrorAction;
  level: 'info' | 'warning' | 'error';
} {
  if (error.status >= 500) return { action: 'breadcrumb', level: 'error' };
  if (error.status === 401) return { action: 'breadcrumb', level: 'info' };
  if (SKIP_API_ERRORS.some((match) => match(error))) {
    return { action: 'breadcrumb', level: 'warning' };
  }
  return { action: 'issue', level: 'error' };
}

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

/**
 * 이슈를 묶기 위한 경로 정리 — 같은 API가 id·날짜마다 다른 이슈로 흩어지지 않게
 * 예: https://api.noturi.com/api/client/todos/2026-11-03?x=1 → /todos/{date}
 * (RN의 URL 구현은 pathname을 지원하지 않는 버전이 있어 정규식으로 처리)
 */
export function normalizeApiPath(url: string): string {
  return (
    url
      .replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]+/i, '')
      .split(/[?#]/)[0]
      // 앱 API 접두사(/api/client 등) 제거
      .replace(/^.*?\/client(?=\/|$)/, '')
      .replace(UUID_PATTERN, '{id}')
      .replace(/\/\d{4}-\d{2}-\d{2}(?=\/|$)/g, '/{date}')
      .replace(/\/\d+(?=\/|$)/g, '/{id}') || '/'
  );
}

/** 이슈 제목 — 예: [400] PATCH /users/me/settings */
export function buildApiErrorTitle(error: ApiErrorInfo): string {
  return `[${error.status}] ${error.method.toUpperCase()} ${error.path}`;
}

/** 이슈 묶는 기준 — 스택이 아니라 [status, method, endpoint] (API 에러는 모두 ky 내부 같은 위치에서 남) */
export function buildApiErrorFingerprint(error: ApiErrorInfo): string[] {
  return [String(error.status), error.method.toUpperCase(), error.path];
}
