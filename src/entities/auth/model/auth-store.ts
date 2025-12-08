import { User, parseUser } from '~/entities/user';
import { authTokenCache } from '~/shared/lib/cache';
import Logger from '~/shared/lib/logger';

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
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
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

  getUser = (): User | null => this.state.user;
  getAccessToken = (): string | null => this.state.accessToken;
  getRefreshToken = (): string | null => this.state.refreshToken;
  getState = () => this.state;

  setLoading = (isInitialLoading: boolean) => this.setState({ isInitialLoading });
  setError = (error: string | null) => this.setState({ error });
  clearError = () => this.setState({ error: null });
  setAuthenticated = (isAuthenticated: boolean) => this.setState({ isAuthenticated });
}

export const authStore = new AuthStore();
