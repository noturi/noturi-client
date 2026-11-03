import { User, parseUser } from '~/entities/user';
import { authTokenCache, tokenCache } from '~/shared/lib/cache';
import Logger from '~/shared/lib/logger';
import { setSentryUser } from '~/shared/lib/sentry';

import type { AuthState } from './types';

class AuthStore {
  private listeners = new Set<() => void>();
  private state: AuthState = {
    isAuthenticated: false,
    isInitialLoading: true,
    error: null,
    user: null,
    accessToken: null,
    refreshToken: null,
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.state;
  getServerSnapshot = () => this.state;

  private setState = (newState: Partial<AuthState>) => {
    const prevUserId = this.state.user?.id;
    this.state = { ...this.state, ...newState };
    if (this.state.user?.id !== prevUserId) setSentryUser(this.state.user?.id);
    this.listeners.forEach((listener) => listener());
  };

  /**
   * 토큰은 있는데 저장된 사용자 정보를 읽지 못한 상태 — 에러는 안 나지만 계정 기준 기능(테마 등)이 깨짐
   * (1.4.1~1.5.1 다크모드 초기화 버그가 이 상태로 리뷰 전까지 드러나지 않았음)
   */
  private reportUnreadableUser = (tokens: { accessToken: string | null; user: string | null }) => {
    if (tokens.accessToken && tokens.user) {
      Logger.error('[auth] 저장된 사용자 정보를 읽지 못함 (토큰은 있음)', {
        keys: (() => {
          try {
            return Object.keys(JSON.parse(tokens.user));
          } catch {
            return 'invalid-json';
          }
        })(),
      });
    }
  };

  saveAuthTokens = async (tokens: { accessToken: string; refreshToken: string; user: User }) => {
    await authTokenCache.saveAuthTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: JSON.stringify(tokens.user),
    });
    this.setState({
      isAuthenticated: true,
      error: null,
      user: tokens.user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  };

  /**
   * 서버에서 받은 최신 사용자 정보로 기기 저장값을 갱신
   * 사용자 정보는 로그인할 때만 저장되므로, 그대로 두면 예전 서버 형식의 값이 몇 달씩 남는다
   * (1.4.1~1.5.1 다크모드 초기화 버그의 근본 원인) — 앱 시작마다 한 번 갱신해 스스로 복구되게 한다
   */
  updateUser = async (user: User) => {
    if (!this.state.isAuthenticated) return;
    await tokenCache.saveToken('user', JSON.stringify(user));
    this.setState({ user });
  };

  clearAuthTokens = async () => {
    await authTokenCache.clearAuthTokens();
    this.setState({
      isAuthenticated: false,
      error: null,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  initializeAuth = async () => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      const user = parseUser(tokens.user);
      const isAuthenticated = !!(tokens.accessToken && tokens.user);
      if (!user) this.reportUnreadableUser(tokens);

      this.setState({
        isAuthenticated,
        isInitialLoading: false,
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      Logger.error('인증 상태 확인 실패:', error);
      this.setState({
        isAuthenticated: false,
        isInitialLoading: false,
        error: '인증 상태 확인에 실패했습니다.',
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    }
  };

  syncFromCache = async () => {
    const tokens = await authTokenCache.getAuthTokens();
    const user = parseUser(tokens.user);
    this.setState({
      isAuthenticated: !!(tokens.accessToken && tokens.user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    });
  };

  setError = (error: string | null) => this.setState({ error });
  clearError = () => this.setState({ error: null });
}

export const authStore = new AuthStore();
