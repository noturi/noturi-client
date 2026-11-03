import { HTTPError } from 'ky';
import { Sentry } from '~/shared/lib/sentry';

import { captureApiResponse, captureCriticalError, captureRenderError } from './sentry-capture';

const mockScope = {
  setLevel: jest.fn(),
  setTag: jest.fn(),
  setFingerprint: jest.fn(),
  setContext: jest.fn(),
};

// ky는 ESM 전용이라 jest-expo에서 변환되지 않음 — 이 모듈이 쓰는 HTTPError만 대체
jest.mock('ky', () => ({
  HTTPError: class HTTPError extends Error {
    name = 'HTTPError';
    response: Response;
    constructor(mockResponse: Response) {
      super(`HTTP ${mockResponse.status}`);
      this.response = mockResponse;
    }
  },
}));

jest.mock('~/shared/lib/sentry', () => ({
  Sentry: {
    addBreadcrumb: jest.fn(),
    captureException: jest.fn(),
    withScope: jest.fn((callback: (s: unknown) => void) => callback(mockScope)),
  },
}));

const BASE = 'https://api.noturi.com/api/client';

function respond(status: number, body?: object) {
  return new Response(body ? JSON.stringify(body) : null, { status });
}

function httpError(status: number) {
  return new (HTTPError as unknown as new (response: Response) => Error)(respond(status));
}

beforeEach(() => jest.clearAllMocks());

describe('captureApiResponse', () => {
  it('처리 안 된 4xx는 [status] METHOD path 이슈로 보내고 요청 본문은 싣지 않음', async () => {
    const request = new Request(`${BASE}/users/me/settings`, {
      method: 'PATCH',
      body: JSON.stringify({ secret: 'memo content' }),
    });
    await captureApiResponse(
      request,
      respond(400, { statusCode: 400, message: 'theme must be enum' }),
    );

    expect(mockScope.setFingerprint).toHaveBeenCalledWith(['400', 'PATCH', '/users/me/settings']);
    expect(mockScope.setContext).toHaveBeenCalledWith('api', {
      method: 'PATCH',
      path: '/users/me/settings',
      status: 400,
      code: undefined,
      message: 'theme must be enum',
    });
    const sent = (Sentry.captureException as jest.Mock).mock.calls[0][0];
    expect(sent.message).toBe('[400] PATCH /users/me/settings');
    expect(JSON.stringify(mockScope.setContext.mock.calls)).not.toContain('memo content');
  });

  it('5xx·401·처리된 비즈니스 코드는 breadcrumb만', async () => {
    const request = new Request(`${BASE}/categories`, { method: 'POST' });
    await captureApiResponse(request, respond(500));
    await captureApiResponse(request, respond(401));
    await captureApiResponse(
      request,
      respond(409, { statusCode: 409, code: 4091, message: 'dup' }),
    );

    expect(Sentry.captureException).not.toHaveBeenCalled();
    expect((Sentry.addBreadcrumb as jest.Mock).mock.calls.map(([b]) => b.level)).toEqual([
      'error',
      'info',
      'warning',
    ]);
  });
});

describe('captureRenderError', () => {
  it('코드 버그로 화면이 멈추면 fatal', () => {
    const error = new TypeError("Cannot read property 'id' of undefined");
    captureRenderError(error, 'in MemoItem');

    expect(mockScope.setLevel).toHaveBeenCalledWith('fatal');
    expect(mockScope.setTag).toHaveBeenCalledWith('render.cause', 'code');
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });

  it('API 실패로 화면을 못 그리면 error', () => {
    captureRenderError(httpError(404));

    expect(mockScope.setLevel).toHaveBeenCalledWith('error');
    expect(mockScope.setTag).toHaveBeenCalledWith('render.cause', 'api');
    expect(mockScope.setFingerprint).toHaveBeenCalledWith(['render-api-failure', '404']);
  });
});

describe('captureCriticalError', () => {
  it('핵심 기능이 5xx로 실패하면 fatal + critical.flow 태그', () => {
    captureCriticalError(httpError(503), 'memo-save');

    expect(mockScope.setLevel).toHaveBeenCalledWith('fatal');
    expect(mockScope.setTag).toHaveBeenCalledWith('critical.flow', 'memo-save');
  });

  it('4xx나 네트워크 실패는 breadcrumb만', () => {
    captureCriticalError(httpError(400), 'memo-save');
    captureCriticalError(new TypeError('Network request failed'), 'todo-toggle');

    expect(Sentry.captureException).not.toHaveBeenCalled();
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(2);
  });
});
