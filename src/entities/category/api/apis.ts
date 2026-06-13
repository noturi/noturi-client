import { KyInstance } from 'ky';
import {
  Category,
  CategoryListParamsDto,
  CategoryListResponseDto,
} from '~/entities/category/model/types';
import { api } from '~/shared/api';

/**
 * Entity Layer - READ 전용 API
 *
 * 이 클래스는 카테고리 엔티티의 조회 작업만 담당합니다.
 * - ✅ GET 요청만 처리
 * - ❌ POST, PUT, DELETE는 features/categories/api/apis.ts에서 처리
 */
export class CategoryApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  private transformBackendCategory(backendCategory: any): Category {
    return {
      id: backendCategory.id,
      name: backendCategory.name,
      color: backendCategory.color,
      icon: backendCategory.icon,
      description: backendCategory.description,
      memoCount: backendCategory.count?.memos || 0,
      createdAt: backendCategory.createdAt,
      updatedAt: backendCategory.updatedAt,
    };
  }

  // 카테고리 목록 조회
  async getCategories(params: CategoryListParamsDto = {}): Promise<CategoryListResponseDto> {
    try {
      const searchParams = new URLSearchParams();

      if (params.includeEmpty !== undefined) {
        searchParams.append('includeEmpty', params.includeEmpty.toString());
      }
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const url = `categories?${searchParams.toString()}`;

      const response = await this.api.get(url);
      const backendData = await response.json<any[]>();

      const transformedData: CategoryListResponseDto = {
        categories: backendData.map((item) => this.transformBackendCategory(item)),
        total: backendData.length,
      };

      return transformedData;
    } catch (error) {
      console.error('Get categories API error:', error);
      throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
    }
  }
}

export const categoryApi = new CategoryApi(api);
