import type { Category, UICategory } from '../model/types';

export const ALL_CATEGORY_NAME = '전체';

export const ALL_CATEGORY_ID = 'all';

/** 카테고리 목록 사이에 "전체"를 끼워 넣음 — allCategoryOrder는 앞에 오는 카테고리 수 (0 = 맨 앞) */
export function insertAllCategory<T, A>(items: T[], all: A, allCategoryOrder = 0): (T | A)[] {
  const index = Math.min(Math.max(allCategoryOrder, 0), items.length);
  return [...items.slice(0, index), all, ...items.slice(index)];
}

/**
 * 카테고리 목록을 필터 바용 UI 데이터로 변환
 * 사용자가 정한 위치(기본 맨 앞)에 "전체"(모든 카테고리 메모 합계)를 추가한다
 */
export function toUICategories(
  categories: Category[] | undefined,
  selectedCategory: string,
  allCategoryOrder = 0,
): UICategory[] {
  if (!categories) return [];

  const totalCount = categories.reduce((sum, cat) => sum + cat.memoCount, 0);

  return insertAllCategory(
    categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: cat.memoCount,
      active: selectedCategory === cat.name,
    })),
    {
      id: ALL_CATEGORY_ID,
      name: ALL_CATEGORY_NAME,
      count: totalCount,
      active: selectedCategory === ALL_CATEGORY_NAME,
    },
    allCategoryOrder,
  );
}

/** "전체"가 섞인 순서 목록 → 순서 저장 요청 (카테고리 sortOrder + "전체" 위치) */
export function toReorderPayload(orderedIds: string[]): {
  categories: { id: string; sortOrder: number }[];
  allCategoryOrder: number;
} {
  const allIndex = orderedIds.indexOf(ALL_CATEGORY_ID);
  const ids = orderedIds.filter((id) => id !== ALL_CATEGORY_ID);
  return {
    categories: ids.map((id, sortOrder) => ({ id, sortOrder })),
    allCategoryOrder: allIndex === -1 ? 0 : allIndex,
  };
}

/** 카테고리명으로 id 조회 — "전체"는 필터 없음(undefined) */
export function findCategoryIdByName(
  categoryName: string,
  categories: Category[] | undefined,
): string | undefined {
  if (categoryName === ALL_CATEGORY_NAME) return undefined;
  return categories?.find((cat) => cat.name === categoryName)?.id;
}
