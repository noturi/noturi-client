import { AuthContext, type AuthContextType, authStore } from '~/entities/auth';
import { User } from '~/entities/user';
import { queryClient } from '~/shared/api/query-client';
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
      queryClient.clear();
      router.replace(HREFS.login());
    } catch (e) {
      Logger.error('로그아웃 실패:', e);
    } finally {
      isLoggingOutRef.current = false;
    }
  }, []);

  useEffect(() => {
    const handleTokenExpired = async () => {
      if (isLoggingOutRef.current) return;
      Logger.warn('토큰 갱신 실패 - 자동 로그아웃');
      await logout();
    };

    const handleTokenRefreshed = async () => {
      await authStore.syncFromCache();
    };

    const unsubExpired = tokenEventManager.onTokenExpired(handleTokenExpired);
    const unsubRefreshed = tokenEventManager.onTokenRefreshed(handleTokenRefreshed);

    return () => {
      unsubExpired();
      unsubRefreshed();
    };
  }, [logout]);

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    isInitialLoading: authState.isInitialLoading,
    error: authState.error,
    saveAuthTokens,
    logout,
    clearError: authStore.clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
