import { User } from '~/entities/user';
import { notificationService } from '~/features/notification';
import { HREFS } from '~/shared/config';
import Logger from '~/shared/lib/logger';
import { tokenEventManager } from '~/shared/model';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import { router } from 'expo-router';

import { authService } from '../model/auth-service';
import { authStore } from '../model/auth-store';
import type { AuthContextType } from '../model/types';

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
  const isLoggingOutRef = useRef(false);

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

      // 로그인 성공 후 푸시 알림 디바이스 등록
      notificationService.registerDevice().catch((error) => {
        Logger.warn('푸시 알림 디바이스 등록 실패:', error);
      });
    } catch (error) {
      if (signal.aborted) return;
      throw error;
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    // 이미 로그아웃 중이면 무시 (무한 루프 방지)
    if (isLoggingOutRef.current) {
      return;
    }
    isLoggingOutRef.current = true;

    try {
      authStore.setError(null);

      // 로그아웃 전 푸시 알림 디바이스 해제 (실패해도 무시)
      try {
        await notificationService.unregisterAllDevices();
      } catch {
        // 401 등 에러 발생해도 로그아웃 진행
      }

      await authService.logout();

      await authStore.clearAuthTokens();
      router.replace(HREFS.login());
    } catch (error) {
      console.error('로그아웃 실패:', error);
      await authStore.clearAuthTokens();
      router.replace(HREFS.login());
    } finally {
      isLoggingOutRef.current = false;
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
      // 이미 로그아웃 중이면 무시 (무한 루프 방지)
      if (isLoggingOutRef.current) {
        return;
      }

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
