import Logger from '../../utils/logger';
import { logErrorResponse } from './logger';
import { ApiError, ErrorResponseBody } from './types';

export const getErrorMessage = (body: ErrorResponseBody | undefined): string => {
  if (!body?.message) {
    return ERROR_MESSAGES.DEFAULT;
  }

  if (body.code && ERROR_CODE_MESSAGES[body.code]) {
    return body.message;
  }

  return body.message || ERROR_MESSAGES.DEFAULT;
};

export const handleErrorResponse = async (request: Request, response: Response) => {
  await logErrorResponse(request, response);

  if (response.status === 401) {
    Logger.warn('401 Unauthorized - 토큰 만료 또는 무효');
    // TODO: AuthContext의 logout 또는 refreshToken 호출
  }

  const body: ErrorResponseBody = await response
    .clone()
    .json()
    .catch(() => ({ statusCode: response.status, message: ERROR_MESSAGES.DEFAULT }));

  if (!body.statusCode) {
    body.statusCode = response.status;
  }
  if (!body.message) {
    body.message = getErrorMessage(body);
  }

  throw new ApiError(body);
};

export const ERROR_MESSAGES = {
  DEFAULT: '요청 처리 중 오류가 발생했습니다.',
  CATEGORY_HAS_MEMOS: '메모가 있는 카테고리는 삭제할 수 없습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
} as const;

export const ERROR_CODE_MESSAGES: Record<number, string> = {
  4092: ERROR_MESSAGES.CATEGORY_HAS_MEMOS,
};
