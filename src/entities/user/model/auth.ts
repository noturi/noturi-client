export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatarUrl: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 타입 가드 함수
const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== 'object') return false;
  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.email === 'string' &&
    typeof record.name === 'string' &&
    typeof record.nickname === 'string' &&
    typeof record.avatarUrl === 'string'
  );
};

export const parseUser = (userString: string | null): User | null => {
  if (!userString) return null;

  try {
    const parsed = JSON.parse(userString);
    return isUser(parsed) ? parsed : null;
  } catch (error) {
    console.error('사용자 정보 파싱 실패:', error);
    return null;
  }
};
