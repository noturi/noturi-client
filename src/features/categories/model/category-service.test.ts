import type { Category } from '~/entities/category';

import { CategoryService } from './category-service';

const category = (id: string, name: string, memoCount: number): Category => ({
  id,
  name,
  memoCount,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
});

const categories = [category('c1', '영화', 3), category('c2', '책', 2)];

describe('CategoryService.transformToUICategories', () => {
  it('맨 앞에 "전체"를 추가하고 합계를 계산한다', () => {
    const result = CategoryService.transformToUICategories(categories, '전체');
    expect(result[0]).toEqual({ id: 'all', name: '전체', count: 5, active: true });
    expect(result).toHaveLength(3);
  });

  it('선택된 카테고리만 active', () => {
    const result = CategoryService.transformToUICategories(categories, '책');
    expect(result.filter((c) => c.active).map((c) => c.name)).toEqual(['책']);
  });

  it('undefined면 빈 배열', () => {
    expect(CategoryService.transformToUICategories(undefined, '전체')).toEqual([]);
  });
});

describe('CategoryService.getCategoryIdByName', () => {
  it('"전체"는 필터 없음(undefined)', () => {
    expect(CategoryService.getCategoryIdByName('전체', categories)).toBeUndefined();
  });

  it('이름으로 id를 찾는다', () => {
    expect(CategoryService.getCategoryIdByName('책', categories)).toBe('c2');
    expect(CategoryService.getCategoryIdByName('없음', categories)).toBeUndefined();
  });
});
