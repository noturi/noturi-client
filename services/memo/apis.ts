import { KyInstance } from "ky";
import { api } from "../api";
import {
  Memo,
  CreateMemoDto,
  UpdateMemoDto,
  MemoListResponseDto,
  MemoListParamsDto,
  BulkDeleteMemosDto,
  CategoryStatsDto,
  MemoSearchResultDto,
} from "./types";

export class MemoApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 메모 목록 조회
  async getMemos(params: MemoListParamsDto = {}): Promise<MemoListResponseDto> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.category) searchParams.append("category", params.category);
      if (params.sort) searchParams.append("sort", params.sort);
      if (params.search) searchParams.append("search", params.search);

      const response = await this.api.get(`memos?${searchParams.toString()}`);
      return response.json<MemoListResponseDto>();
    } catch (error) {
      console.error("Get memos API error:", error);
      throw new Error("메모 목록을 불러오는데 실패했습니다.");
    }
  }

  // 특정 메모 조회
  async getMemo(id: number): Promise<Memo> {
    try {
      const response = await this.api.get(`memos/${id}`);
      return response.json<Memo>();
    } catch (error) {
      console.error("Get memo API error:", error);
      throw new Error("메모를 불러오는데 실패했습니다.");
    }
  }

  // 메모 생성
  async createMemo(data: CreateMemoDto): Promise<Memo> {
    try {
      const response = await this.api.post("memos", {
        json: data,
      });
      return response.json<Memo>();
    } catch (error) {
      console.error("Create memo API error:", error);
      throw new Error("메모 생성에 실패했습니다.");
    }
  }

  // 메모 수정
  async updateMemo(data: UpdateMemoDto): Promise<Memo> {
    try {
      const { id, ...updateData } = data;
      const response = await this.api.patch(`memos/${id}`, {
        json: updateData,
      });
      return response.json<Memo>();
    } catch (error) {
      console.error("Update memo API error:", error);
      throw new Error("메모 수정에 실패했습니다.");
    }
  }

  // 메모 삭제
  async deleteMemo(id: number): Promise<void> {
    try {
      await this.api.delete(`memos/${id}`);
    } catch (error) {
      console.error("Delete memo API error:", error);
      throw new Error("메모 삭제에 실패했습니다.");
    }
  }

  // 메모 일괄 삭제
  async bulkDeleteMemos(data: BulkDeleteMemosDto): Promise<void> {
    try {
      await this.api.delete("memos/bulk", {
        json: data,
      });
    } catch (error) {
      console.error("Bulk delete memos API error:", error);
      throw new Error("메모 일괄 삭제에 실패했습니다.");
    }
  }

  // 카테고리 목록 조회
  async getCategories(): Promise<CategoryStatsDto[]> {
    try {
      const response = await this.api.get("memos/categories");
      return response.json<CategoryStatsDto[]>();
    } catch (error) {
      console.error("Get categories API error:", error);
      throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
    }
  }

  // 메모 검색
  async searchMemos(query: string): Promise<MemoSearchResultDto> {
    try {
      const response = await this.api.get(`memos/search?q=${encodeURIComponent(query)}`);
      return response.json<MemoSearchResultDto>();
    } catch (error) {
      console.error("Search memos API error:", error);
      throw new Error("메모 검색에 실패했습니다.");
    }
  }

  // 메모 통계 조회
  async getMemoStats(): Promise<{
    totalMemos: number;
    totalCategories: number;
    averageRating: number;
    recentMemosCount: number;
  }> {
    try {
      const response = await this.api.get("memos/stats");
      return response.json();
    } catch (error) {
      console.error("Get memo stats API error:", error);
      throw new Error("메모 통계를 불러오는데 실패했습니다.");
    }
  }
}

export const memoApi = new MemoApi(api);