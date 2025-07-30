export const MEMO_ALERTS = {
  SUCCESS: {
    title: "성공",
    message: "메모가 성공적으로 저장되었습니다.",
  },
  ERROR: {
    title: "오류", 
    message: "메모 저장에 실패했습니다. 다시 시도해주세요.",
  },
  VALIDATION: {
    EMPTY_CONTENT: {
      title: "알림",
      message: "메모 내용을 입력해주세요.",
    },
    NO_CATEGORY: {
      title: "알림", 
      message: "카테고리를 선택해주세요.",
    },
    CATEGORY_NOT_FOUND: {
      title: "오류",
      message: "선택된 카테고리를 찾을 수 없습니다.",
    },
    NEW_CATEGORY_NOT_IMPLEMENTED: {
      title: "알림",
      message: "새 카테고리 생성은 아직 구현되지 않았습니다. 기존 카테고리를 선택해주세요.",
    },
  },
} as const;