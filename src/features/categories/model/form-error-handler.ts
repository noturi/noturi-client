import { getErrorBody } from '~/shared/api/errors';
import { MESSAGES } from '~/shared/model';

// 카테고리 생성 실패 메시지 — 서버 메시지(중복, 최대 개수 초과 등)를 우선 사용
export async function getCategoryCreateErrorMessage(error: unknown): Promise<string> {
  const body = await getErrorBody(error);
  return body?.message || MESSAGES.CATEGORY.CREATE_ERROR;
}
