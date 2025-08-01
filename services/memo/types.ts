// 메모 타입 정의 (백엔드 실제 응답에 맞춤)
export interface Memo {
  id: string; // UUID 형태
  title: string;
  content: string;
  category: any; // 객체 형태로 오는 경우 대비
  categoryId: string;
  rating: number;
  description?: string;
  experienceDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 메모 생성 요청
export interface CreateMemoDto {
  title: string;
  content: string;
  categoryId: string; // UUID 형태
  rating: number;
  description?: string;
}

// 메모 수정 요청
export interface UpdateMemoDto extends Partial<CreateMemoDto> {
  id: string;
}

// 메모 목록 응답 (백엔드 실제 응답 구조에 맞춤)
export interface MemoListResponseDto {
  data: Memo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 메모 목록 조회 파라미터
export interface MemoListParamsDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  rating?: number;
  sortBy?: "createdAt" | "rating" | "title";
  sortOrder?: "asc" | "desc";
  search?: string;
  startDate?: string;
  endDate?: string;
}

// 메모 일괄 삭제 요청
export interface BulkDeleteMemosDto {
  ids: string[];
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
