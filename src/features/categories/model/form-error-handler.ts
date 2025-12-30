import { HTTPError } from 'ky';
import { getErrorBody } from '~/shared/api/errors';

export interface CategoryFormHandler {
  setError: (field: any, error: { message: string }) => void;
}

// 카테고리 관련 에러 코드
export const CATEGORY_ERROR_CODES = {
  DUPLICATE_CATEGORY: 4091,
  CATEGORY_HAS_MEMOS: 4092,
} as const;

// 카테고리 폼 에러 매핑
const CATEGORY_FORM_ERROR_MAP: Record<number, string> = {
  [CATEGORY_ERROR_CODES.DUPLICATE_CATEGORY]: 'categoryName',
  [CATEGORY_ERROR_CODES.CATEGORY_HAS_MEMOS]: 'categoryDeleteError',
};

export const handleCategoryFormError = async (error: unknown, form: CategoryFormHandler) => {
  if (!(error instanceof HTTPError)) return;

  const body = await getErrorBody(error);
  if (!body?.code) return;

  const fieldName = CATEGORY_FORM_ERROR_MAP[body.code];

  if (fieldName) {
    form.setError(fieldName, {
      message: body.message,
    });
  }
};
