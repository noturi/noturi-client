import { ERROR_MESSAGES, getErrorBody } from '~/shared/api/errors';

import { Alert } from 'react-native';

// 카테고리 생성 실패 처리 — 서버 메시지(중복, 최대 개수 초과 등)를 그대로 노출
export const handleCategoryCreateError = async (error: unknown) => {
  const body = await getErrorBody(error);
  Alert.alert('오류', body?.message || ERROR_MESSAGES.DEFAULT);
};
