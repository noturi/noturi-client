import type { Category } from '../model/types';
import { findCategoryIdByName, toUICategories } from './category-transform';

const category = (id: string, name: string, memoCount: number): Category => ({
  id,
  name,
  memoCount,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
});

const categories = [category('c1', '영화', 3), category('c2', '책', 2)];

describe('toUICategories', () => {
  it('맨 앞에 "전체"를 추가하고 합계를 계산한다', () => {
    const result = toUICategories(categories, '전체');
    expect(result[0]).toEqual({ id: 'all', name: '전체', count: 5, active: true });
    expect(result).toHaveLength(3);
  });

  it('선택된 카테고리만 active', () => {
    const result = toUICategories(categories, '책');
    expect(result.filter((c) => c.active).map((c) => c.name)).toEqual(['책']);
  });

  it('undefined면 빈 배열', () => {
    expect(toUICategories(undefined, '전체')).toEqual([]);
  });
});

describe('findCategoryIdByName', () => {
  it('"전체"는 필터 없음(undefined)', () => {
    expect(findCategoryIdByName('전체', categories)).toBeUndefined();
  });

  it('이름으로 id를 찾는다', () => {
    expect(findCategoryIdByName('책', categories)).toBe('c2');
    expect(findCategoryIdByName('없음', categories)).toBeUndefined();
  });
});
