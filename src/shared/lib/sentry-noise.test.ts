import { isNoiseError } from './sentry-noise';

describe('isNoiseError', () => {
  it('네트워크 끊김·타임아웃·취소는 노이즈', () => {
    expect(isNoiseError(new TypeError('Network request failed'))).toBe(true);
    expect(isNoiseError(Object.assign(new Error('x'), { name: 'TimeoutError' }))).toBe(true);
    expect(isNoiseError(Object.assign(new Error('x'), { name: 'AbortError' }))).toBe(true);
    expect(isNoiseError('Request aborted')).toBe(true);
  });

  it('코드 에러는 노이즈가 아님', () => {
    expect(isNoiseError(new TypeError("Cannot read property 'id' of null"))).toBe(false);
    expect(isNoiseError(undefined)).toBe(false);
  });
});
