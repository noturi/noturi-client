import Logger from '~/shared/lib/logger';

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

const isOptionalString = (value: unknown) => value == null || typeof value === 'string';

/**
 * 기기에 저장된 사용자 정보를 검증·정규화
 * - 2026-04-30 이전 서버는 name/avatarUrl을 null로 내려줬고(Apple 로그인 등), 그때 저장된 값이 기기에 남아 있음
 * - 이를 거부하면 로그인 상태인데 user가 null이 되어 계정 기준 설정(테마 등)이 매 실행마다 기본값으로 초기화됨
 */
const toUser = (obj: unknown): User | null => {
  if (!obj || typeof obj !== 'object') return null;
  const record = obj as Record<string, unknown>;
  if (
    typeof record.id !== 'string' ||
    typeof record.email !== 'string' ||
    typeof record.nickname !== 'string' ||
    !isOptionalString(record.name) ||
    !isOptionalString(record.avatarUrl)
  ) {
    return null;
  }
  return {
    id: record.id,
    email: record.email,
    nickname: record.nickname,
    name: (record.name as string | null | undefined) ?? '',
    avatarUrl: (record.avatarUrl as string | null | undefined) ?? '',
  };
};

export const parseUser = (userString: string | null): User | null => {
  if (!userString) return null;

  try {
    return toUser(JSON.parse(userString));
  } catch (error) {
    Logger.error('사용자 정보 파싱 실패:', error);
    return null;
  }
};
