import { HTTPError } from 'ky';
import Logger from '~/shared/lib/logger';
import { Sentry } from '~/shared/lib/sentry';
import { isNoiseError } from '~/shared/lib/sentry-noise';

import { type ErrorResponseBody } from './errors';
import {
  type ApiErrorInfo,
  buildApiErrorFingerprint,
  buildApiErrorTitle,
  classifyApiError,
  normalizeApiPath,
} from './sentry-policy';

class ApiError extends Error {
  name = 'ApiError';
}

async function readErrorBody(response: Response): Promise<ErrorResponseBody | null> {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

/**
 * 실패한 API 응답을 정책에 따라 기록 (ky afterResponse 훅에서 호출)
 * 요청 본문은 보내지 않음 — 메모 내용 같은 사용자 데이터가 들어 있음
 */
export async function captureApiResponse(request: Request, response: Response) {
  const body = await readErrorBody(response);
  const info: ApiErrorInfo = {
    status: response.status,
    method: request.method,
    path: normalizeApiPath(request.url),
    code: typeof body?.code === 'number' ? body.code : undefined,
  };
  const title = buildApiErrorTitle(info);
  const { action, level } = classifyApiError(info);

  Logger.debug(`[API] ${title}`, body?.message);

  if (action === 'breadcrumb') {
    Sentry.addBreadcrumb({ category: 'http', level, message: title, data: { code: info.code } });
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setFingerprint(buildApiErrorFingerprint(info));
    scope.setTag('api.status', String(info.status));
    scope.setContext('api', {
      method: info.method,
      path: info.path,
      status: info.status,
      code: info.code,
      message: body?.message,
    });
    Sentry.captureException(new ApiError(title));
  });
}

function getHttpStatus(error: unknown): number | undefined {
  return error instanceof HTTPError ? error.response.status : undefined;
}

/** 에러가 API 실패에서 왔는지 — API 실패는 원인이 API 에러 쪽에 이미 기록됨 */
function isApiOrigin(error: unknown) {
  return !(error instanceof Error) || error instanceof HTTPError || isNoiseError(error);
}

/**
 * 화면 렌더링 실패 (ErrorBoundary)
 * - API 실패로 화면을 못 그림 → error (원인은 API 이슈/breadcrumb에 있음)
 * - 코드 버그로 화면이 멈춤 → fatal
 */
export function captureRenderError(error: unknown, componentStack?: string | null) {
  if (isApiOrigin(error)) {
    const status = getHttpStatus(error) ?? 'network';
    Sentry.withScope((scope) => {
      scope.setLevel('error');
      scope.setTag('render.cause', 'api');
      scope.setFingerprint(['render-api-failure', String(status)]);
      Sentry.captureException(new Error(`화면 렌더링 실패 (API ${status})`));
    });
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel('fatal');
    scope.setTag('render.cause', 'code');
    if (componentStack) scope.setContext('react', { componentStack });
    Sentry.captureException(error);
  });
}

export type CriticalFlow = 'login' | 'memo-save' | 'todo-save' | 'todo-toggle';

/**
 * 핵심 기능 실패 (MutationCache onError에서 meta.critical인 것만 호출)
 * - 5xx: 사용자가 핵심 기능에서 막힘 → fatal (서버 이슈와 겹치지만 어떤 기능인지는 앱만 앎)
 * - 4xx: 비즈니스 거절 가능성 → breadcrumb (처리 안 된 4xx는 captureApiResponse가 이미 이슈로 보냄)
 * - 네트워크 실패: 모바일에선 흔함 → breadcrumb
 */
export function captureCriticalError(error: unknown, flow: CriticalFlow | undefined) {
  const status = getHttpStatus(error);
  if (status == null || status < 500) {
    Sentry.addBreadcrumb({
      category: 'critical',
      level: 'warning',
      message: `핵심 기능 실패 (${flow ?? 'unknown'}, ${status ?? 'network'})`,
    });
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel('fatal');
    scope.setTag('critical.flow', flow ?? 'unknown');
    scope.setTag('api.status', String(status));
    scope.setFingerprint(['critical', flow ?? 'unknown', String(status)]);
    Sentry.captureException(new Error(`핵심 기능 실패: ${flow ?? 'unknown'} (${status})`));
  });
}
