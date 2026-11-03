/** 사용자 정보를 읽지 못했지만 토큰은 있는 로그인 상태 — 이 세션의 계정으로 취급 */
export const UNKNOWN_ACCOUNT_KEY = 'unknown-account';

/**
 * 테마를 적용할 계정 키 (없으면 로그아웃)
 * - 로그인 여부는 토큰(isAuthenticated)으로만 판단한다. 사용자 정보가 없다고 로그아웃으로 보면
 *   테마가 매 실행마다 기본값으로 초기화된다 (1.4.1~1.5.1 다크모드 버그)
 * - 사용자 id는 계정이 바뀌었는지 알아내는 데만 쓴다 (바뀌면 그 계정의 서버 테마를 새로 적용)
 */
export function getThemeAccountKey(auth: {
  isAuthenticated: boolean;
  user: { id: string } | null;
}): string | undefined {
  if (!auth.isAuthenticated) return undefined;
  return auth.user?.id ?? UNKNOWN_ACCOUNT_KEY;
}
