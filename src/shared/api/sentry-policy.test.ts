import {
  buildApiErrorFingerprint,
  buildApiErrorTitle,
  classifyApiError,
  normalizeApiPath,
} from './sentry-policy';

const info = (status: number, code?: number) => ({ status, code, method: 'patch', path: '/x' });

describe('classifyApiError', () => {
  it('5xx는 서버 책임이라 breadcrumb(error)', () => {
    expect(classifyApiError(info(500))).toEqual({ action: 'breadcrumb', level: 'error' });
    expect(classifyApiError(info(503))).toEqual({ action: 'breadcrumb', level: 'error' });
  });

  it('401은 토큰 갱신 흐름이라 breadcrumb(info)', () => {
    expect(classifyApiError(info(401))).toEqual({ action: 'breadcrumb', level: 'info' });
  });

  it('안내 문구가 있는 비즈니스 에러 코드는 breadcrumb(warning)', () => {
    expect(classifyApiError(info(409, 4091))).toEqual({ action: 'breadcrumb', level: 'warning' });
    expect(classifyApiError(info(400, 4092))).toEqual({ action: 'breadcrumb', level: 'warning' });
  });

  it('그 밖의 4xx는 기본으로 이슈', () => {
    for (const status of [400, 403, 404, 409, 422]) {
      expect(classifyApiError(info(status)).action).toBe('issue');
    }
    // 등록되지 않은 비즈니스 코드도 이슈
    expect(classifyApiError(info(400, 9999)).action).toBe('issue');
  });
});

describe('normalizeApiPath', () => {
  it('호스트·접두사·쿼리스트링을 제거', () => {
    expect(normalizeApiPath('https://api.noturi.com/api/client/users/me/settings?a=1')).toBe(
      '/users/me/settings',
    );
  });

  it('UUID·날짜·숫자 id를 자리표시자로 바꿈', () => {
    expect(
      normalizeApiPath('https://h/api/client/memos/ea3db703-f982-4605-aea3-6b054cb53671/rating/4'),
    ).toBe('/memos/{id}/rating/{id}');
    expect(normalizeApiPath('https://h/api/client/todos/date/2026-11-03')).toBe(
      '/todos/date/{date}',
    );
  });

  it('접두사가 없는 주소도 처리', () => {
    expect(normalizeApiPath('http://localhost:3000/health')).toBe('/health');
    expect(normalizeApiPath('https://h/api/client')).toBe('/');
  });
});

describe('이슈 제목·묶는 기준', () => {
  const error = { status: 400, method: 'patch', path: '/users/me/settings' };

  it('제목은 [status] METHOD path', () => {
    expect(buildApiErrorTitle(error)).toBe('[400] PATCH /users/me/settings');
  });

  it('묶는 기준은 status·method·path', () => {
    expect(buildApiErrorFingerprint(error)).toEqual(['400', 'PATCH', '/users/me/settings']);
  });
});
