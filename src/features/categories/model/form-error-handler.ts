import { HTTPError } from 'ky';
import { getErrorBody } from '~/shared/api/errors';

import { Alert } from 'react-native';

export interface CategoryFormHandler {
  setError: (field: any, error: { message: string }) => void;
}

// 카테고리 관련 에러 코드
export const CATEGORY_ERROR_CODES = {
  DUPLICATE_CATEGORY: 4091,
  CATEGORY_HAS_MEMOS: 4092,
  MAX_CATEGORIES_EXCEEDED: 4093,
} as const;

// Alert로 처리할 에러 코드들
const ALERT_ERROR_CODES: Set<number> = new Set([
  CATEGORY_ERROR_CODES.DUPLICATE_CATEGORY,
  CATEGORY_ERROR_CODES.MAX_CATEGORIES_EXCEEDED,
]);

// 카테고리 폼 에러 매핑 (form.setError용)
const CATEGORY_FORM_ERROR_MAP: Record<number, string> = {
  [CATEGORY_ERROR_CODES.CATEGORY_HAS_MEMOS]: 'categoryDeleteError',
};

export const handleCategoryFormError = async (error: unknown, form: CategoryFormHandler) => {
  if (!(error instanceof HTTPError)) return;

  const body = await getErrorBody(error);
  if (!body?.code) return;

  // Alert로 처리할 에러
  if (ALERT_ERROR_CODES.has(body.code)) {
    Alert.alert('오류', body.message);
    return;
  }

  // Form 에러로 처리
  const fieldName = CATEGORY_FORM_ERROR_MAP[body.code];
  if (fieldName) {
    form.setError(fieldName, {
      message: body.message,
    });
  }
};
