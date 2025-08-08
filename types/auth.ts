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

// 타입 가드 함수들
export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.nickname === 'string' &&
    typeof obj.avatarUrl === 'string'
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

// 토큰 유효성 검사
export const isValidToken = (token: string | null): boolean => {
  return !!(token && token.trim().length > 0);
};

// 인증 상태 검사
export const isAuthenticated = (tokens: {
  accessToken: string | null;
  refreshToken: string | null;
  user: string | null;
}): boolean => {
  return !!(
    isValidToken(tokens.accessToken) &&
    isValidToken(tokens.refreshToken) &&
    parseUser(tokens.user)
  );
};
