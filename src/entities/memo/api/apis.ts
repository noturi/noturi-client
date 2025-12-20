import { KyInstance } from 'ky';
import {
  CategoryStatsDto,
  Memo,
  MemoListParamsDto,
  MemoListResponseDto,
  MemoSearchResultDto,
  MemoStatsDto,
} from '~/entities/memo/model/types';
import { api } from '~/shared/api';

/**
 * Entity Layer - READ 전용 API
 *
 * 이 클래스는 메모 엔티티의 조회 작업만 담당합니다.
 * - ✅ GET 요청만 처리
 * - ❌ POST, PUT, DELETE는 features/memo/api/apis.ts에서 처리
 */
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
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.rating !== undefined) searchParams.append('rating', params.rating.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

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
  async getMemoStats(): Promise<MemoStatsDto> {
    const response = await this.api.get('memos/stats');
    return response.json<MemoStatsDto>();
  }
}

export const memoApi = new MemoApi(api);
