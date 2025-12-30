export const ERROR_MESSAGES = {
  DEFAULT: '요청 처리 중 오류가 발생했습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  DUPLICATE_CATEGORY: '이미 존재하는 카테고리입니다',
  CATEGORY_HAS_MEMOS: '메모가 있는 카테고리는 삭제할 수 없습니다.',
} as const;

export const ERROR_CODE_MESSAGES: Record<number, string> = {
  4091: ERROR_MESSAGES.DUPLICATE_CATEGORY,
  4092: ERROR_MESSAGES.CATEGORY_HAS_MEMOS,
};

export interface ErrorResponseBody {
  statusCode: number;
  code?: number;
  message: string;
  details?: unknown;
}

export async function getErrorBody(error: unknown): Promise<ErrorResponseBody | null> {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: Response }).response;
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return null;
}
