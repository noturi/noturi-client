import type { Memo } from '../model/types';
import { toUIMemos } from './to-ui-memos';

const memo = (overrides: Partial<Memo> = {}): Memo => ({
  id: 'm1',
  title: '제목',
  content: '내용',
  category: { id: 'c1', name: '영화', color: '#ff0000' },
  categoryId: 'c1',
  rating: 4.5,
  userId: 'u1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('toUIMemos', () => {
  it('undefined면 빈 배열', () => {
    expect(toUIMemos(undefined)).toEqual([]);
  });

  it('UI 필드로 변환한다', () => {
    const [ui] = toUIMemos([memo()]);
    expect(ui).toMatchObject({
      id: 'm1',
      title: '제목',
      content: '내용',
      rating: 4.5,
      category: { id: 'c1', name: '영화', color: '#ff0000' },
      timeAgo: '방금 전',
    });
  });

  it('카테고리가 없으면 "미분류"로 표시한다', () => {
    const [ui] = toUIMemos([memo({ category: null })]);
    expect(ui.category).toEqual({ id: 'default', name: '미분류', color: '#6b7280' });
  });
});
