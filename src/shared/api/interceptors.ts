import { HTTPError } from 'ky';
import { authTokenCache } from '~/shared/lib/cache';

import { refreshAccessToken } from './auth';

export async function requestInterceptor(request: Request) {
  const { accessToken } = await authTokenCache.getAuthTokens();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
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
    }
  }
}
