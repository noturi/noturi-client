import type { Category } from '../model/types';
import {
  findCategoryIdByName,
  insertAllCategory,
  toReorderPayload,
  toUICategories,
} from './category-transform';

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

  it('사용자가 정한 위치에 "전체"를 넣는다', () => {
    expect(toUICategories(categories, '전체', 1).map((c) => c.name)).toEqual([
      '영화',
      '전체',
      '책',
    ]);
    expect(toUICategories(categories, '전체', 2).map((c) => c.name)).toEqual([
      '영화',
      '책',
      '전체',
    ]);
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

describe('insertAllCategory', () => {
  it('범위를 벗어난 위치는 맨 앞/맨 뒤로 (카테고리를 지워 개수가 줄어든 경우)', () => {
    expect(insertAllCategory(['a', 'b'], '*', 9)).toEqual(['a', 'b', '*']);
    expect(insertAllCategory(['a', 'b'], '*', -1)).toEqual(['*', 'a', 'b']);
  });
});

describe('toReorderPayload', () => {
  it('"전체"를 뺀 순서로 sortOrder를 매기고, "전체" 앞의 카테고리 수를 위치로', () => {
    expect(toReorderPayload(['c1', 'all', 'c2'])).toEqual({
      categories: [
        { id: 'c1', sortOrder: 0 },
        { id: 'c2', sortOrder: 1 },
      ],
      allCategoryOrder: 1,
    });
  });

  it('"전체"가 맨 앞이면 0', () => {
    expect(toReorderPayload(['all', 'c1']).allCategoryOrder).toBe(0);
  });
});
