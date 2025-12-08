import { HTTPError } from 'ky';

import { getToken } from './auth';
import { handleErrorResponse } from './errors';
import { logRequest } from './logger';
import { refreshAccessToken } from './token-refresh';

export const beforeRequestHook = async (request: Request) => {
  const token = await getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

export const afterResponseHook = async (request: Request, _options: any, response: Response) => {
  logRequest(request, response);

  if (!response.ok && response.status !== 401) {
    await handleErrorResponse(request, response);
  }

  return response;
};

export const beforeRetryHook = async ({ request, error }: { request: Request; error: Error }) => {
  if (error instanceof HTTPError && error.response.status === 401) {
    const success = await refreshAccessToken();

    if (success) {
      const newToken = await getToken();
      if (newToken) {
        request.headers.set('Authorization', `Bearer ${newToken}`);
      }
    } else {
      throw new Error('Token refresh failed');
    }
  }
};
