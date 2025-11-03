export const MESSAGES = {
  // 메모 관련
  MEMO: {
    CREATE_SUCCESS: '메모가 생성되었습니다.',
    CREATE_ERROR: '메모 생성에 실패했습니다.',
    UPDATE_SUCCESS: '메모가 수정되었습니다.',
    UPDATE_ERROR: '메모 수정에 실패했습니다.',
    DELETE_SUCCESS: '메모가 삭제되었습니다.',
    DELETE_ERROR: '메모 삭제에 실패했습니다.',
    TITLE_REQUIRED: '제목을 입력해주세요.',
    CONTENT_REQUIRED: '내용을 입력해주세요.',
    CATEGORY_REQUIRED: '카테고리를 선택해주세요.',
  },

  // 카테고리 관련
  CATEGORY: {
    CREATE_SUCCESS: '새 카테고리가 생성되었습니다.',
    CREATE_ERROR: '카테고리 생성에 실패했습니다.',
    UPDATE_SUCCESS: '카테고리가 수정되었습니다.',
    UPDATE_ERROR: '카테고리 수정에 실패했습니다.',
    DELETE_SUCCESS: '카테고리가 삭제되었습니다.',
    DELETE_ERROR: '카테고리 삭제에 실패했습니다.',
    NAME_REQUIRED: '카테고리 이름을 입력해주세요.',
    NOT_FOUND: '선택된 카테고리를 찾을 수 없습니다.',
  },

  // 인증 관련
  AUTH: {
    LOGIN_SUCCESS: '로그인되었습니다.',
    LOGIN_ERROR: '로그인에 실패했습니다.',
    LOGOUT_SUCCESS: '로그아웃되었습니다.',
    LOGOUT_ERROR: '로그아웃에 실패했습니다.',
    TOKEN_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  },

  // 일반적인 에러
  COMMON: {
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
    VALIDATION_ERROR: '입력값을 확인해주세요.',
    PERMISSION_DENIED: '권한이 없습니다.',
  },
} as const;

// 타입 추출
export type MessageKey = keyof typeof MESSAGES;
export type MessageCategory<T extends MessageKey> = keyof (typeof MESSAGES)[T];
