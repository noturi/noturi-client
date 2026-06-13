import { Category, UICategory } from '~/entities/category';

/**
 * 카테고리 서비스 클래스
 * 카테고리 관련 데이터 변환을 담당
 */
export class CategoryService {
  /**
   * 백엔드 카테고리 데이터를 UI용 카테고리 데이터로 변환
   * "전체" 카테고리를 포함하여 반환
   */
  static transformToUICategories(
    backendCategories: Category[] | undefined,
    selectedCategory: string,
  ): UICategory[] {
    if (!backendCategories) return [];

    const totalCount = backendCategories.reduce((sum, cat) => sum + cat.memoCount, 0);

    return [
      {
        id: 'all',
        name: '전체',
        count: totalCount,
        active: selectedCategory === '전체',
      },
      ...backendCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: cat.memoCount,
        active: selectedCategory === cat.name,
      })),
    ];
  }

  /**
   * 선택된 카테고리명으로부터 카테고리 ID를 찾기
   */
  static getCategoryIdByName(
    categoryName: string,
    categories: Category[] | undefined,
  ): string | undefined {
    if (categoryName === '전체') return undefined;
    return categories?.find((cat) => cat.name === categoryName)?.id;
  }
}
