import { User, parseUser } from '~/entities/user';

import { useCallback } from 'react';

import { authTokenCache } from './cache';

export const useTokens = () => {
  const getUser = useCallback(async (): Promise<User | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return parseUser(tokens.user);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      return null;
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error('액세스 토큰 조회 실패:', error);
      return null;
    }
  }, []);

  const getRefreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return tokens.refreshToken;
    } catch (error) {
      console.error('리프레시 토큰 조회 실패:', error);
      return null;
    }
  }, []);

  const saveAuthTokens = useCallback(
    async (tokens: { accessToken: string; refreshToken: string; user: User }) => {
      await authTokenCache.saveAuthTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: JSON.stringify(tokens.user),
      });
    },
    [],
  );

  const clearAuthTokens = useCallback(async () => {
    await authTokenCache.clearAuthTokens();
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await authTokenCache.getAuthTokens();
      return !!(tokens.accessToken && tokens.user);
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return false;
    }
  }, []);

  return {
    getUser,
    getAccessToken,
    getRefreshToken,
    saveAuthTokens,
    clearAuthTokens,
    checkAuthStatus,
  };
};
