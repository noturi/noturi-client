import { CATEGORY_COLORS, CATEGORY_ICONS, DEFAULT_CATEGORIES } from '@/constants';

import { categoryApi } from './apis';
import { Category, CreateCategoryDto, MergeCategoriesDto, UpdateCategoryDto } from './types';

/**
 * UI 카테고리 타입 정의
 */
export interface UICategory {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

/**
 * 카테고리 서비스 클래스
 * 카테고리 관련 비즈니스 로직과 데이터 변환을 담당
 */
export class CategoryService {
  /**
   * 카테고리 생성 전 데이터 검증 및 변환
   */
  async createCategoryWithValidation(data: CreateCategoryDto): Promise<Category> {
    // 데이터 검증
    if (!data.name.trim()) {
      throw new Error('카테고리 이름은 필수입니다.');
    }

    if (data.name.trim().length > 20) {
      throw new Error('카테고리 이름은 20자 이하여야 합니다.');
    }

    // 특수문자 검증
    const invalidChars = /[<>:"/\\|?*]/g;
    if (invalidChars.test(data.name)) {
      throw new Error('카테고리 이름에는 특수문자를 사용할 수 없습니다.');
    }

    // 중복 확인
    const existsResult = await categoryApi.checkCategoryExists(data.name.trim());
    if (existsResult.exists) {
      throw new Error('이미 존재하는 카테고리 이름입니다.');
    }

    // 데이터 정제
    const processedData: CreateCategoryDto = {
      ...data,
      name: data.name.trim(),
      color: data.color || this.getRandomColor(),
      icon: data.icon || this.getRandomIcon(),
      description: data.description?.trim(),
    };

    return await categoryApi.createCategory(processedData);
  }

  /**
   * 카테고리 수정 전 데이터 검증 및 변환
   */
  async updateCategoryWithValidation(data: UpdateCategoryDto): Promise<Category> {
    // 데이터 검증
    if (data.name && !data.name.trim()) {
      throw new Error('카테고리 이름은 빈 값일 수 없습니다.');
    }

    if (data.name && data.name.trim().length > 20) {
      throw new Error('카테고리 이름은 20자 이하여야 합니다.');
    }

    // 특수문자 검증
    if (data.name) {
      const invalidChars = /[<>:"/\\|?*]/g;
      if (invalidChars.test(data.name)) {
        throw new Error('카테고리 이름에는 특수문자를 사용할 수 없습니다.');
      }
    }

    // 이름 변경 시 중복 확인
    if (data.name) {
      const existsResult = await categoryApi.checkCategoryExists(data.name.trim());
      if (existsResult.exists && existsResult.category?.id !== data.id) {
        throw new Error('이미 존재하는 카테고리 이름입니다.');
      }
    }

    // 데이터 정제
    const processedData: UpdateCategoryDto = {
      ...data,
      name: data.name?.trim(),
      description: data.description?.trim(),
    };

    return await categoryApi.updateCategory(processedData);
  }

  /**
   * 카테고리 삭제 전 확인 및 처리
   */
  async deleteCategoryWithValidation(id: string, moveMemosToCategory?: string): Promise<void> {
    const category = await categoryApi.getCategory(id);

    if (category.memoCount > 0 && !moveMemosToCategory) {
      throw new Error(
        '메모가 있는 카테고리는 삭제할 수 없습니다. 메모를 다른 카테고리로 이동하거나 삭제해주세요.',
      );
    }

    // 메모를 다른 카테고리로 이동하는 경우
    if (category.memoCount > 0 && moveMemosToCategory) {
      await this.mergeCategoriesWithValidation({
        sourceId: id,
        targetId: moveMemosToCategory,
      });
    } else {
      await categoryApi.deleteCategory(id);
    }
  }

  /**
   * 카테고리 병합 전 검증
   */
  async mergeCategoriesWithValidation(data: MergeCategoriesDto): Promise<void> {
    if (data.sourceId === data.targetId) {
      throw new Error('같은 카테고리끼리는 병합할 수 없습니다.');
    }

    // 두 카테고리가 모두 존재하는지 확인
    const [sourceCategory, targetCategory] = await Promise.all([
      categoryApi.getCategory(data.sourceId),
      categoryApi.getCategory(data.targetId),
    ]);

    if (!sourceCategory || !targetCategory) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    return await categoryApi.mergeCategories(data);
  }

  /**
   * 기본 카테고리 생성
   */
  async createDefaultCategories(): Promise<Category[]> {
    const createdCategories: Category[] = [];

    for (const defaultCategory of DEFAULT_CATEGORIES) {
      try {
        // 이미 존재하는지 확인
        const existsResult = await categoryApi.checkCategoryExists(defaultCategory.name);

        if (!existsResult.exists) {
          const category = await categoryApi.createCategory(defaultCategory);
          createdCategories.push(category);
        }
      } catch (error) {
        console.error(`기본 카테고리 '${defaultCategory.name}' 생성 실패:`, error);
      }
    }

    return createdCategories;
  }

  /**
   * 카테고리 사용량 분석
   */
  async getCategoryUsageAnalysis() {
    const [stats, distribution] = await Promise.all([
      categoryApi.getCategoryStats(),
      categoryApi.getCategoryDistribution(),
    ]);

    const analysis = {
      ...stats,
      distribution,
      insights: {
        mostPopular: distribution[0]?.categoryName || '없음',
        leastPopular: distribution[distribution.length - 1]?.categoryName || '없음',
        utilizationRate: (stats.categoriesWithMemos / stats.totalCategories) * 100,
        recommendation: this.generateUsageRecommendation(stats, distribution),
      },
    };

    return analysis;
  }

  /**
   * 카테고리 정리 제안
   */
  async getCategoryCleanupSuggestions() {
    const [unusedCategories, distribution] = await Promise.all([
      categoryApi.getUnusedCategories(),
      categoryApi.getCategoryDistribution(),
    ]);

    const lowUsageCategories = distribution.filter((d) => d.memoCount <= 2);

    return {
      unusedCategories,
      lowUsageCategories,
      suggestions: {
        toDelete: unusedCategories.map((c) => c.name),
        toMerge: this.suggestMergeableCategories(distribution),
        toRename: this.suggestRenameableCategories(distribution),
      },
    };
  }

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

  /**
   * 정렬 옵션에서 정렬 타입 추출
   */
  static getSortTypeFromOptions(
    sortOptions: { name: string; active: boolean }[],
  ): 'rating' | 'createdAt' {
    const activeSort = sortOptions.find((option) => option.active)?.name;
    return activeSort === '평점' ? 'rating' : 'createdAt';
  }

  /**
   * 랜덤 색상 생성
   */
  private getRandomColor(): string {
    return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
  }

  /**
   * 랜덤 아이콘 생성
   */
  private getRandomIcon(): string {
    return CATEGORY_ICONS[Math.floor(Math.random() * CATEGORY_ICONS.length)];
  }

  /**
   * 사용량 추천 생성
   */
  private generateUsageRecommendation(stats: any, distribution: any[]): string {
    if (stats.totalCategories === 0) {
      return '카테고리를 생성하여 메모를 체계적으로 관리해보세요.';
    }

    if (stats.categoriesWithMemos / stats.totalCategories < 0.5) {
      return '사용하지 않는 카테고리가 많습니다. 정리를 고려해보세요.';
    }

    if (distribution.length > 0 && distribution[0].memoCount > stats.averageMemosPerCategory * 3) {
      return '특정 카테고리에 메모가 너무 집중되어 있습니다. 세분화를 고려해보세요.';
    }

    return '카테고리가 적절히 활용되고 있습니다.';
  }

  /**
   * 병합 가능한 카테고리 제안
   */
  private suggestMergeableCategories(distribution: any[]): { source: string; target: string }[] {
    // 간단한 로직: 유사한 이름이나 적은 사용량의 카테고리들
    const lowUsage = distribution.filter((d) => d.memoCount <= 3);
    const suggestions: { source: string; target: string }[] = [];

    // 실제로는 더 복잡한 로직이 필요 (이름 유사도, 의미 분석 등)
    for (let i = 0; i < lowUsage.length - 1; i += 2) {
      suggestions.push({
        source: lowUsage[i].categoryName,
        target: lowUsage[i + 1].categoryName,
      });
    }

    return suggestions;
  }

  /**
   * 이름 변경 제안
   */
  private suggestRenameableCategories(
    distribution: any[],
  ): { current: string; suggested: string }[] {
    // 간단한 예시 로직
    return distribution
      .filter((d) => d.categoryName.length > 15)
      .map((d) => ({
        current: d.categoryName,
        suggested: d.categoryName.substring(0, 10) + '...',
      }));
  }
}

export const categoryService = new CategoryService();
