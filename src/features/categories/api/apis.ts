import { KyInstance } from 'ky';
import {
  Category,
  CreateCategoryDto,
  MergeCategoriesDto,
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from '~/entities/category/model/types';
import { api } from '~/shared/api';

/**
 * Feature Layer - CUD 전용 API
 *
 * 이 클래스는 카테고리의 변경 작업만 담당합니다.
 * - ✅ POST, PATCH, DELETE 요청만 처리
 * - ❌ GET은 entities/category/api/apis.ts에서 처리
 */
export class CategoryMutationApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 카테고리 생성
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await this.api.post('categories', {
      json: data,
    });
    return response.json<Category>();
  }

  // 카테고리 수정
  async updateCategory(data: UpdateCategoryDto): Promise<Category> {
    try {
      const { id, ...updateData } = data;
      const response = await this.api.patch(`categories/${id}`, {
        json: updateData,
      });
      return response.json<Category>();
    } catch (error) {
      console.error('Update category API error:', error);
      throw new Error('카테고리 수정에 실패했습니다.');
    }
  }

  // 카테고리 삭제
  async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`categories/${id}`);
  }

  // 카테고리 순서 변경
  async reorderCategories(data: ReorderCategoriesDto): Promise<void> {
    try {
      await this.api.patch('categories/reorder', {
        json: data,
      });
    } catch (error) {
      console.error('Reorder categories API error:', error);
      throw new Error('카테고리 순서 변경에 실패했습니다.');
    }
  }

  // 카테고리 병합
  async mergeCategories(data: MergeCategoriesDto): Promise<void> {
    try {
      await this.api.post('categories/merge', {
        json: data,
      });
    } catch (error) {
      console.error('Merge categories API error:', error);
      throw new Error('카테고리 병합에 실패했습니다.');
    }
  }
}

export const categoryMutationApi = new CategoryMutationApi(api);
