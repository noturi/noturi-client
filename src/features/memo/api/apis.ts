import { KyInstance } from 'ky';
import {
  BulkDeleteMemosDto,
  CategoryStatsDto,
  CreateMemoDto,
  Memo,
  MemoListParamsDto,
  MemoListResponseDto,
  MemoSearchResultDto,
  UpdateMemoDto,
} from '~/entities/memo';
import { api } from '~/shared/api';

export class MemoApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 메모 목록 조회
  async getMemos(params: MemoListParamsDto = {}): Promise<MemoListResponseDto> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.categoryIds && params.categoryIds.length > 0) {
      for (const id of params.categoryIds) searchParams.append('categoryIds', id);
    }
    if (params.rating !== undefined) searchParams.append('rating', params.rating.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.search) searchParams.append('search', params.search);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    const url = `memos?${searchParams.toString()}`;

    const response = await this.api.get(url);
    const data = await response.json<MemoListResponseDto>();

    return data;
  }

  // 특정 메모 조회
  async getMemo(id: string): Promise<Memo> {
    const response = await this.api.get(`memos/${id}`);
    return response.json<Memo>();
  }

  // 메모 생성
  async createMemo(data: CreateMemoDto): Promise<Memo> {
    const response = await this.api.post('memos', {
      json: data,
    });
    return response.json<Memo>();
  }

  // 메모 수정
  async updateMemo(data: UpdateMemoDto): Promise<Memo> {
    const { id, ...updateData } = data;
    const response = await this.api.put(`memos/${id}`, {
      json: updateData,
    });
    return response.json<Memo>();
  }

  // 메모 삭제
  async deleteMemo(id: string): Promise<void> {
    await this.api.delete(`memos/${id}`);
  }

  // 메모 일괄 삭제
  async bulkDeleteMemos(data: BulkDeleteMemosDto): Promise<void> {
    await this.api.delete('memos/bulk', {
      json: data,
    });
  }

  // 카테고리 목록 조회
  async getCategories(): Promise<CategoryStatsDto[]> {
    const response = await this.api.get('memos/categories');
    return response.json<CategoryStatsDto[]>();
  }

  // 메모 검색
  async searchMemos(query: string): Promise<MemoSearchResultDto> {
    const response = await this.api.get(`memos/search?q=${encodeURIComponent(query)}`);
    return response.json<MemoSearchResultDto>();
  }

  // 메모 통계 조회
  async getMemoStats(): Promise<{
    totalMemos: number;
    totalCategories: number;
    averageRating: number;
    recentMemosCount: number;
  }> {
    const response = await this.api.get('memos/stats');
    return response.json();
  }
}

export const memoApi = new MemoApi(api);
