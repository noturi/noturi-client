import { api } from '~/shared/api';

import { type User, toUser } from '../model/auth';

/** 내 프로필 — 기기에 저장된 사용자 정보를 서버 값으로 갱신할 때 사용 */
export async function fetchMyProfile(): Promise<User | null> {
  const response = await api.get('users/me');
  return toUser(await response.json());
}
