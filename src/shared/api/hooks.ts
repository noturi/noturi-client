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

  // 401은 beforeRetry에서 처리하므로 여기서는 다른 에러만 처리
  if (!response.ok && response.status !== 401) {
    await handleErrorResponse(request, response);
  }

  return response;
};

export const beforeRetryHook = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  if (response.status === 401) {
    const success = await refreshAccessToken();

    if (success) {
      // 갱신 성공 - 새 토큰으로 헤더 업데이트
      const newToken = await getToken();
      if (newToken) {
        request.headers.set('Authorization', `Bearer ${newToken}`);
      }
    } else {
      // 갱신 실패 - 재시도 중단 (에러 발생)
      throw new Error('Token refresh failed');
    }
  }
};
