import { ApiError } from '~/shared/api/types';

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

export const handleCategoryFormError = (error: unknown, form: CategoryFormHandler) => {
  if (!(error instanceof ApiError)) return;

  const fieldName = error.code ? CATEGORY_FORM_ERROR_MAP[error.code] : null;

  if (fieldName) {
    form.setError(fieldName, {
      message: error.message,
    });
  }
};
