import AsyncStorage from '@react-native-async-storage/async-storage';

/** 마지막으로 메모를 남긴 카테고리 — 새 메모 작성 시 미리 선택 */
const KEY = 'noturi-last-memo-category';

export const lastMemoCategory = {
  get: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set: async (categoryId: string | undefined) => {
    try {
      if (categoryId) await AsyncStorage.setItem(KEY, categoryId);
      else await AsyncStorage.removeItem(KEY);
    } catch {
      // 기억 실패는 무시 — 다음 작성 때 직접 고르면 됨
    }
  },
};
