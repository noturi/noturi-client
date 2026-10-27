import { getErrorCode, getErrorMessage } from './error';

describe('getErrorCode', () => {
  it('code 속성을 문자열로 반환한다', () => {
    expect(getErrorCode({ code: 'ERR_REQUEST_CANCELED' })).toBe('ERR_REQUEST_CANCELED');
    expect(getErrorCode({ code: 4091 })).toBe('4091');
  });

  it('code가 없거나 객체가 아니면 undefined', () => {
    expect(getErrorCode(new Error('x'))).toBeUndefined();
    expect(getErrorCode(null)).toBeUndefined();
    expect(getErrorCode('boom')).toBeUndefined();
  });
});

describe('getErrorMessage', () => {
  it('Error는 message, 그 외는 문자열화', () => {
    expect(getErrorMessage(new Error('실패'))).toBe('실패');
    expect(getErrorMessage('raw')).toBe('raw');
  });
});
