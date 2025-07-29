// 메모 타입 정의
export interface Memo {
  id: number;
  title: string;
  content: string;
  category: string;
  rating: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 메모 생성 요청
export interface CreateMemoDto {
  title: string;
  content: string;
  category: string;
  rating: number;
  description?: string;
}

// 메모 수정 요청
export interface UpdateMemoDto extends Partial<CreateMemoDto> {
  id: number;
}

// 메모 목록 응답
export interface MemoListResponseDto {
  memos: Memo[];
  total: number;
  page: number;
  limit: number;
}

// 메모 목록 조회 파라미터
export interface MemoListParamsDto {
  page?: number;
  limit?: number;
  category?: string;
  sort?: "latest" | "rating" | "title";
  search?: string;
}

// 메모 일괄 삭제 요청
export interface BulkDeleteMemosDto {
  ids: number[];
}

// 카테고리 통계
export interface CategoryStatsDto {
  name: string;
  count: number;
}

// 메모 검색 결과
export interface MemoSearchResultDto {
  memos: Memo[];
  total: number;
  highlightedFields?: string[];
}