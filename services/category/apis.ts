import { KyInstance } from "ky";
import { api } from "../api";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryListResponseDto,
  CategoryListParamsDto,
  CategoryStatsDto,
  ReorderCategoriesDto,
  MergeCategoriesDto,
  CategoryDistributionDto,
} from "./types";

export class CategoryApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 카테고리 목록 조회
  async getCategories(params: CategoryListParamsDto = {}): Promise<CategoryListResponseDto> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.includeEmpty !== undefined) {
        searchParams.append("includeEmpty", params.includeEmpty.toString());
      }
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const response = await this.api.get(`categories?${searchParams.toString()}`);
      return response.json<CategoryListResponseDto>();
    } catch (error) {
      console.error("Get categories API error:", error);
      throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
    }
  }

  // 특정 카테고리 조회
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await this.api.get(`categories/${id}`);
      return response.json<Category>();
    } catch (error) {
      console.error("Get category API error:", error);
      throw new Error("카테고리를 불러오는데 실패했습니다.");
    }
  }

  // 카테고리 생성
  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      const response = await this.api.post("categories", {
        json: data,
      });
      return response.json<Category>();
    } catch (error) {
      console.error("Create category API error:", error);
      throw new Error("카테고리 생성에 실패했습니다.");
    }
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
      console.error("Update category API error:", error);
      throw new Error("카테고리 수정에 실패했습니다.");
    }
  }

  // 카테고리 삭제
  async deleteCategory(id: number): Promise<void> {
    try {
      await this.api.delete(`categories/${id}`);
    } catch (error) {
      console.error("Delete category API error:", error);
      throw new Error("카테고리 삭제에 실패했습니다.");
    }
  }

  // 카테고리 통계 조회
  async getCategoryStats(): Promise<CategoryStatsDto> {
    try {
      const response = await this.api.get("categories/stats");
      return response.json<CategoryStatsDto>();
    } catch (error) {
      console.error("Get category stats API error:", error);
      throw new Error("카테고리 통계를 불러오는데 실패했습니다.");
    }
  }

  // 카테고리 순서 변경
  async reorderCategories(data: ReorderCategoriesDto): Promise<void> {
    try {
      await this.api.patch("categories/reorder", {
        json: data,
      });
    } catch (error) {
      console.error("Reorder categories API error:", error);
      throw new Error("카테고리 순서 변경에 실패했습니다.");
    }
  }

  // 카테고리 병합
  async mergeCategories(data: MergeCategoriesDto): Promise<void> {
    try {
      await this.api.post("categories/merge", {
        json: data,
      });
    } catch (error) {
      console.error("Merge categories API error:", error);
      throw new Error("카테고리 병합에 실패했습니다.");
    }
  }

  // 카테고리별 메모 분포 조회
  async getCategoryDistribution(): Promise<CategoryDistributionDto[]> {
    try {
      const response = await this.api.get("categories/distribution");
      return response.json<CategoryDistributionDto[]>();
    } catch (error) {
      console.error("Get category distribution API error:", error);
      throw new Error("카테고리 분포를 불러오는데 실패했습니다.");
    }
  }

  // 사용하지 않는 카테고리 조회
  async getUnusedCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get("categories/unused");
      return response.json<Category[]>();
    } catch (error) {
      console.error("Get unused categories API error:", error);
      throw new Error("사용하지 않는 카테고리를 불러오는데 실패했습니다.");
    }
  }

  // 카테고리 검색
  async searchCategories(query: string): Promise<Category[]> {
    try {
      const response = await this.api.get(`categories/search?q=${encodeURIComponent(query)}`);
      return response.json<Category[]>();
    } catch (error) {
      console.error("Search categories API error:", error);
      throw new Error("카테고리 검색에 실패했습니다.");
    }
  }

  // 카테고리 중복 확인
  async checkCategoryExists(name: string): Promise<{ exists: boolean; category?: Category }> {
    try {
      const response = await this.api.get(`categories/check-exists?name=${encodeURIComponent(name)}`);
      return response.json<{ exists: boolean; category?: Category }>();
    } catch (error) {
      console.error("Check category exists API error:", error);
      throw new Error("카테고리 중복 확인에 실패했습니다.");
    }
  }
}

export const categoryApi = new CategoryApi(api);