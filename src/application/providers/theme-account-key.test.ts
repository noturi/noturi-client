import { UNKNOWN_ACCOUNT_KEY, getThemeAccountKey } from './theme-account-key';

describe('getThemeAccountKey', () => {
  it('토큰이 없으면 로그아웃(undefined)', () => {
    expect(getThemeAccountKey({ isAuthenticated: false, user: null })).toBeUndefined();
    expect(getThemeAccountKey({ isAuthenticated: false, user: { id: 'u1' } })).toBeUndefined();
  });

  it('로그인 상태면 사용자 id', () => {
    expect(getThemeAccountKey({ isAuthenticated: true, user: { id: 'u1' } })).toBe('u1');
  });

  it('토큰은 있는데 사용자 정보를 못 읽어도 로그아웃으로 보지 않음 (다크모드 초기화 버그 회귀 방지)', () => {
    expect(getThemeAccountKey({ isAuthenticated: true, user: null })).toBe(UNKNOWN_ACCOUNT_KEY);
  });
});
