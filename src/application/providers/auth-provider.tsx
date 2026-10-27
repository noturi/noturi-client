import { clearAuthTokens as clearWidgetTokens } from '@modules/widget-bridge';
import { AuthContext, type AuthContextType, authStore } from '~/entities/auth';
import { User } from '~/entities/user';
import { authApi } from '~/features/auth';
import { queryClient } from '~/shared/api/query-client';
import { queryPersister } from '~/shared/api/query-persister';
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

  /**
   * @param revokeSession 서버 세션(리프레시 토큰) 폐기 여부 — 토큰 만료로 인한 자동 로그아웃이면 이미 무효라 생략
   */
  const logout = useCallback(async ({ revokeSession = true }: { revokeSession?: boolean } = {}) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      authStore.setError(null);
      if (revokeSession) {
        // 실패해도 로컬 로그아웃은 진행 (오프라인 등) — 세션은 만료 시 자연 소멸
        await authApi.logout().catch((e) => Logger.warn('서버 로그아웃 실패:', e));
      }
      await clearWidgetTokens().catch(() => {});
      await authStore.clearAuthTokens();
      queryClient.clear();
      // 기기에 저장된 캐시도 삭제 — 다른 계정으로 로그인했을 때 이전 계정 데이터가 복원되지 않게
      await queryPersister.removeClient();
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
      await logout({ revokeSession: false });
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

  return <AuthContext value={value}>{children}</AuthContext>;
};
