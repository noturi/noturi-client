import { User } from '~/entities/user';
import { HREFS } from '~/shared/constants';
import { tokenEventManager, useTokens } from '~/shared/lib';
import Logger from '~/shared/lib/logger';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { authService } from './auth-service';

interface AuthContextType {
  getUser: () => Promise<User | null>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [authState, setAuthState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokens = useTokens();

  const clearError = () => setError(null);

  const getUser = async (): Promise<User | null> => {
    const rawUser = await tokens.getUser();
    return rawUser && typeof rawUser === 'object' ? rawUser : null;
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = await tokens.checkAuthStatus();
        setAuthState(authenticated);
      } catch (error) {
        Logger.error('인증 상태 확인 실패:', error);
        setError('인증 상태 확인에 실패했습니다.');
        setAuthState(false);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeAuth();
  }, [tokens]);

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
  }, []);

  // 토큰 저장
  const saveAuthTokens = async (authTokens: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => {
    try {
      setError(null);
      await tokens.saveAuthTokens(authTokens);
      setAuthState(true);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      setError('토큰 저장에 실패했습니다.');
      throw error;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setAuthState(false);
      // 로그인 페이지로 리다이렉트
      router.replace(HREFS.login());
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setError('로그아웃에 실패했습니다.');
      // 에러가 있어도 상태는 로그아웃 상태로 변경
      setAuthState(false);
      // 에러가 있어도 로그인 페이지로 이동
      router.replace(HREFS.login());
    }
  };

  // 토큰 갱신
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      setError(null);
      const result = await authService.refreshAccessToken();

      if (result.success) {
        setAuthState(true);
        return true;
      } else {
        setError(result.error || '세션이 만료되었습니다. 다시 로그인해주세요.');
        setAuthState(false);
        return false;
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      setError('토큰 갱신에 실패했습니다.');
      setAuthState(false);
      return false;
    }
  };

  const value: AuthContextType = {
    getUser,
    getAccessToken: tokens.getAccessToken,
    getRefreshToken: tokens.getRefreshToken,
    isAuthenticated: authState,
    isInitialLoading,
    error,
    saveAuthTokens,
    logout,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
