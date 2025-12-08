import ky from 'ky';

import { authTokenCache } from '../lib/cache';
import Logger from '../lib/logger';
import { tokenEventManager } from '../model/token-event-manager';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = doRefresh();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

async function doRefresh(): Promise<boolean> {
  try {
    const tokens = await authTokenCache.getAuthTokens();
    const currentRefreshToken = tokens.refreshToken;

    if (!currentRefreshToken) {
      Logger.warn('리프레시 토큰 없음 - 로그아웃 필요');
      tokenEventManager.emitTokenExpired();
      return false;
    }

    const response = await ky
      .post(`${process.env.EXPO_PUBLIC_BASE_URL}/client/auth/refresh`, {
        json: { refreshToken: currentRefreshToken },
        timeout: 5000,
      })
      .json<{ accessToken: string; refreshToken?: string }>();

    await authTokenCache.saveAuthTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || currentRefreshToken,
      user: tokens.user || '',
    });

    Logger.info('토큰 갱신 성공');
    return true;
  } catch (error) {
    Logger.error('토큰 갱신 실패:', error);
    tokenEventManager.emitTokenExpired();
    return false;
  }
}
