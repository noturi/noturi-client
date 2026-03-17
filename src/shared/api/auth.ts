import ky, { HTTPError } from 'ky';

import { authTokenCache } from '../lib/cache';
import { tokenEventManager } from '../model/token-event-manager';

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh();
  const result = await refreshPromise;
  refreshPromise = null;
  return result;
}

async function doRefresh(): Promise<boolean> {
  const tokens = await authTokenCache.getAuthTokens();

  if (!tokens.refreshToken) {
    tokenEventManager.emitTokenExpired();
    return false;
  }

  try {
    const response = await ky
      .post(`${process.env.EXPO_PUBLIC_BASE_URL}/client/auth/refresh`, {
        json: { refreshToken: tokens.refreshToken },
        timeout: 5000,
      })
      .json<{ tokens: { accessToken: string; refreshToken: string } }>();

    const newTokens = {
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken || tokens.refreshToken,
      user: tokens.user || '',
    };

    await authTokenCache.saveAuthTokens(newTokens);
    tokenEventManager.emitTokenRefreshed(newTokens);

    return true;
  } catch (error) {
    // 4xx: refresh token이 만료/무효 → 로그아웃
    // 5xx, 네트워크 에러, 타임아웃: 일시적 장애 → 로그아웃하지 않음
    if (error instanceof HTTPError && error.response.status < 500) {
      tokenEventManager.emitTokenExpired();
    }

    return false;
  }
}
