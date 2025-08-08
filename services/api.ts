import ky from 'ky';

import * as SecureStore from 'expo-secure-store';

const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 0,
  signal: undefined,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          console.log('401 Unauthorized - 토큰 만료 또는 무효');
          // TODO: AuthContext의 logout 또는 refreshToken 호출
        }
        if (!response.ok) {
          try {
            const body = await response
              .clone()
              .json()
              .catch(() => undefined);
            const appCode = body?.code as number | undefined;
            const message = body?.message || '요청 처리 중 오류가 발생했습니다.';
            const details = body?.details;
            const error = new Error(message) as Error & {
              status?: number;
              code?: number;
              details?: unknown;
            };
            error.status = response.status;
            error.code = appCode;
            error.details = details;
            throw error;
          } catch (e) {
            // JSON 파싱 불가 시 상태코드 기반 기본 메시지
            const error = new Error('요청 처리 중 오류가 발생했습니다.') as Error & {
              status?: number;
            };
            error.status = response.status;
            throw error;
          }
        }
        return response;
      },
    ],
  },
});
