import ky from 'ky';

import { authTokenCache } from '../lib/cache';
import Logger from '../lib/logger';
import { tokenEventManager } from '../model/token-event-manager';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * 토큰 갱신 (중복 요청 방지)
 * 여러 요청이 동시에 401을 받아도 한 번만 갱신
 */
export async function refreshAccessToken(): Promise<boolean> {
  // 이미 갱신 중이면 기존 Promise 반환
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

    // 토큰 갱신 API 호출 (별도 ky 인스턴스 사용 - 훅 없이)
    const response = await ky
      .post(`${process.env.EXPO_PUBLIC_BASE_URL}/client/auth/refresh`, {
        json: { refreshToken: currentRefreshToken },
        timeout: 5000,
      })
      .json<{ accessToken: string; refreshToken?: string }>();

    // 새 토큰 저장
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
