import { memoListResponseSchema, memoSchema } from './schemas';

// 실제 서버 응답 형태 (Decimal rating은 문자열, 카테고리 없는 메모는 categoryId null)
const serverMemo = {
  id: 'm1',
  title: '제목',
  content: '',
  category: null,
  categoryId: null,
  rating: '4.5',
  userId: 'u1',
  createdAt: '2026-10-27T00:00:00Z',
  updatedAt: '2026-10-27T00:00:00Z',
};

describe('memoSchema', () => {
  it('문자열 rating을 숫자로 정규화한다', () => {
    const memo = memoSchema.parse(serverMemo);
    expect(memo.rating).toBe(4.5);
  });

  it('카테고리 없는 메모(categoryId null)를 허용한다', () => {
    expect(memoSchema.safeParse(serverMemo).success).toBe(true);
  });

  it('숫자 rating도 그대로 통과한다', () => {
    expect(memoSchema.parse({ ...serverMemo, rating: 3 }).rating).toBe(3);
  });

  it('숫자로 바꿀 수 없는 rating은 거부한다', () => {
    expect(memoSchema.safeParse({ ...serverMemo, rating: 'abc' }).success).toBe(false);
  });
});

describe('memoListResponseSchema', () => {
  it('목록 응답의 각 메모도 정규화한다', () => {
    const res = memoListResponseSchema.parse({
      data: [serverMemo, { ...serverMemo, id: 'm2', rating: '0' }],
      total: 2,
      page: 1,
      limit: 50,
      totalPages: 1,
    });
    expect(res.data.map((m) => m.rating)).toEqual([4.5, 0]);
  });
});
