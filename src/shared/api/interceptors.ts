import ky, { HTTPError } from 'ky';
import { authTokenCache } from '~/shared/lib/cache';

import { refreshAccessToken } from './auth';

/** 기기 시간대 (IANA) — 서버가 사용자별 자정 이월·반복 생성·연속 달성일의 "오늘"을 계산하는 기준 */
function getDeviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

export async function requestInterceptor(request: Request) {
  const { accessToken } = await authTokenCache.getAuthTokens();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const timeZone = getDeviceTimeZone();
  if (timeZone) {
    request.headers.set('X-Timezone', timeZone);
  }
}

export async function retryInterceptor({ request, error }: { request: Request; error: Error }) {
  if (error instanceof HTTPError && error.response.status === 401) {
    const success = await refreshAccessToken();

    if (success) {
      const { accessToken } = await authTokenCache.getAuthTokens();
      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
    } else {
      return ky.stop;
    }
  }
}
