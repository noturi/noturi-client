import { AuthContext, type AuthContextType, authStore } from '~/entities/auth';
import { User } from '~/entities/user';
import { refreshAccessToken as doRefreshToken } from '~/shared/api/token-refresh';
import { HREFS } from '~/shared/config';
import Logger from '~/shared/lib/logger';
import { tokenEventManager } from '~/shared/model';

import { type ReactNode, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import { router } from 'expo-router';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);

  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    authStore.initializeAuth();
  }, []);

  const saveAuthTokens = useCallback(
    async (tokens: { accessToken: string; refreshToken: string; user: User }) => {
      await authStore.saveAuthTokens(tokens);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      authStore.setError(null);
      await authStore.clearAuthTokens();
      router.replace(HREFS.login());
    } catch (e) {
      Logger.error('로그아웃 실패:', e);
    } finally {
      isLoggingOutRef.current = false;
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    authStore.setError(null);
    const success = await doRefreshToken();

    if (success) {
      authStore.setAuthenticated(true);
    } else {
      authStore.setError('토큰 갱신에 실패했습니다.');
    }

    return success;
  }, []);

  useEffect(() => {
    const handleTokenExpired = async () => {
      if (isLoggingOutRef.current) return;
      Logger.warn('토큰 갱신 실패 - 자동 로그아웃');
      await logout();
    };

    return tokenEventManager.onTokenExpired(handleTokenExpired);
  }, [logout]);

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
    clearError: authStore.clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
