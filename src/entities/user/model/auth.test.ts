import { parseUser } from './auth';

const base = {
  id: 'u1',
  email: 'a@b.com',
  nickname: 'nick',
  name: '이름',
  avatarUrl: 'https://x/y.png',
};

describe('parseUser', () => {
  it('정상 사용자 정보를 그대로 반환', () => {
    expect(parseUser(JSON.stringify(base))).toEqual(base);
  });

  it('예전 서버가 저장한 null name/avatarUrl을 빈 문자열로 정규화 (테마 초기화 버그 회귀 방지)', () => {
    const legacy = { ...base, name: null, avatarUrl: null };
    expect(parseUser(JSON.stringify(legacy))).toEqual({ ...base, name: '', avatarUrl: '' });
  });

  it('name/avatarUrl이 없어도 허용', () => {
    const { name: _n, avatarUrl: _a, ...rest } = base;
    expect(parseUser(JSON.stringify(rest))).toEqual({ ...rest, name: '', avatarUrl: '' });
  });

  it('id가 없거나 형식이 잘못되면 null', () => {
    expect(parseUser(JSON.stringify({ ...base, id: undefined }))).toBeNull();
    expect(parseUser(JSON.stringify({ ...base, avatarUrl: 123 }))).toBeNull();
    expect(parseUser('not json')).toBeNull();
    expect(parseUser(null)).toBeNull();
  });
});
