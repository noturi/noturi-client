import { KyInstance } from 'ky';
import { BulkDeleteMemosDto, CreateMemoDto, Memo, UpdateMemoDto } from '~/entities/memo';
import { api } from '~/shared/api';

/**
 * Feature Layer - CUD 전용 API
 *
 * 이 클래스는 메모 피처의 변경 작업만 담당합니다.
 * - ✅ POST, PUT, DELETE 요청만 처리
 * - ❌ GET 요청은 entities/memo/api/apis.ts에서 처리
 */
export class MemoMutationApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
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
}

export const memoMutationApi = new MemoMutationApi(api);
