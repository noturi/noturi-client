import ky from 'ky';

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
      .json<{ accessToken: string; refreshToken?: string }>();

    await authTokenCache.saveAuthTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || tokens.refreshToken,
      user: tokens.user || '',
    });

    return true;
  } catch {
    tokenEventManager.emitTokenExpired();
    return false;
  }
}
