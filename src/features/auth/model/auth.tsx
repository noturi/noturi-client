import { User, parseUser } from '~/entities/user';
import { authTokenCache } from '~/shared/lib/cache';
import Logger from '~/shared/lib/logger';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import { router } from 'expo-router';

import { HREFS } from '@/shared/config';
import { tokenEventManager } from '@/shared/model';

import { authService } from './auth-service';

interface AuthContextType {
  getUser: () => User | null;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;

  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;

  saveAuthTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => Promise<void>;

  logout: () => Promise<void>;

  refreshAccessToken: () => Promise<boolean>;

  clearError: () => void;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  error: string | null;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

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
    try {
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
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      this.setState({ error: '토큰 저장에 실패했습니다.' });
      throw error;
    }
  };

  clearAuthTokens = async () => {
    try {
      await authTokenCache.clearAuthTokens();
      this.setState({
        isAuthenticated: false,
        error: null,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
      this.setState({ error: '로그아웃에 실패했습니다.' });
      throw error;
    }
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

  getUser = (): User | null => {
    return this.state.user;
  };

  getAccessToken = (): string | null => {
    return this.state.accessToken;
  };

  getRefreshToken = (): string | null => {
    return this.state.refreshToken;
  };

  setLoading = (isInitialLoading: boolean) => {
    this.setState({ isInitialLoading });
  };

  setError = (error: string | null) => {
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setAuthenticated = (isAuthenticated: boolean) => {
    this.setState({ isAuthenticated });
  };

  getState = () => this.state;
}

const authStore = new AuthStore();

const useOneTaskAtTime = () => {
  const abortController = useRef<AbortController | null>(null);
  const cancelPendingTask = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    return abortController.current.signal;
  }, []);

  return cancelPendingTask;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );

  const cancelPendingTask = useOneTaskAtTime();

  const clearError = () => authStore.clearError();

  // 초기 인증 상태 확인
  useEffect(() => {
    authStore.initializeAuth();
  }, []);

  const saveAuthTokens = async (authTokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    const signal = cancelPendingTask();

    try {
      await authStore.saveAuthTokens(authTokens);

      if (signal.aborted) return;
    } catch (error) {
      if (signal.aborted) return;
      throw error;
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      authStore.setError(null);
      await authService.logout();

      await authStore.clearAuthTokens();
      router.replace(HREFS.login());
    } catch (error) {
      console.error('로그아웃 실패:', error);
      await authStore.clearAuthTokens();
      router.replace(HREFS.login());
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const signal = cancelPendingTask();
    try {
      authStore.setError(null);
      const result = await authService.refreshAccessToken(signal);

      if (signal.aborted) return false;

      if (result.success) {
        // 토큰이 이미 authService에서 저장됨
        authStore.setAuthenticated(true);
        authStore.setError(null);
        return true;
      } else {
        authStore.setError(result.error || '세션이 만료되었습니다. 다시 로그인해주세요.');
        await authStore.clearAuthTokens();
        return false;
      }
    } catch (error) {
      if (signal.aborted) return false;
      console.error('토큰 갱신 실패:', error);
      authStore.setError('토큰 갱신에 실패했습니다.');
      await authStore.clearAuthTokens();
      return false;
    }
  }, [cancelPendingTask]);

  // 토큰 만료 이벤트 처리
  useEffect(() => {
    const handleTokenExpired = async () => {
      Logger.warn('토큰 만료 감지 - 자동 갱신 시도');

      const refreshSuccess = await refreshAccessToken();

      if (!refreshSuccess) {
        Logger.warn('토큰 갱신 실패 - 자동 로그아웃 처리');
        await logout();
      }
    };

    // 토큰 만료 이벤트 리스너 등록
    const unsubscribe = tokenEventManager.onTokenExpired(handleTokenExpired);

    return unsubscribe;
  }, [refreshAccessToken, logout]);

  const value: AuthContextType = {
    getUser: authStore.getUser,
    getAccessToken: authStore.getAccessToken,
    getRefreshToken: authStore.getRefreshToken,
    isAuthenticated: authState.isAuthenticated,
    isInitialLoading: authState.isInitialLoading,
    error: authState.error,
    saveAuthTokens,
    logout,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
