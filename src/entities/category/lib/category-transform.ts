import type { Category, UICategory } from '../model/types';

export const ALL_CATEGORY_NAME = '전체';

/**
 * 카테고리 목록을 필터 바용 UI 데이터로 변환
 * 맨 앞에 "전체"(모든 카테고리 메모 합계)를 추가한다
 */
export function toUICategories(
  categories: Category[] | undefined,
  selectedCategory: string,
): UICategory[] {
  if (!categories) return [];

  const totalCount = categories.reduce((sum, cat) => sum + cat.memoCount, 0);

  return [
    {
      id: 'all',
      name: ALL_CATEGORY_NAME,
      count: totalCount,
      active: selectedCategory === ALL_CATEGORY_NAME,
    },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: cat.memoCount,
      active: selectedCategory === cat.name,
    })),
  ];
}

/** 카테고리명으로 id 조회 — "전체"는 필터 없음(undefined) */
export function findCategoryIdByName(
  categoryName: string,
  categories: Category[] | undefined,
): string | undefined {
  if (categoryName === ALL_CATEGORY_NAME) return undefined;
  return categories?.find((cat) => cat.name === categoryName)?.id;
}
