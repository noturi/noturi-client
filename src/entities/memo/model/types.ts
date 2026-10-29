// 메모에 포함되는 카테고리 요약
export interface MemoCategory {
  id: string;
  name: string;
  color: string;
}

// 메모 타입 정의 (백엔드 실제 응답에 맞춤)
export interface Memo {
  id: string; // UUID 형태
  title: string;
  content: string;
  category: MemoCategory | null;
  categoryId: string | null; // 카테고리 없는 메모는 null
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
  categoryId?: string; // UUID 형태, 선택사항
  rating?: number; // 0(별점 없음)이면 생략
  description?: string;
}

// 메모 수정 요청
export interface UpdateMemoDto extends Partial<CreateMemoDto> {
  id: string;
}

// 메모 목록 응답 (백엔드 실제 응답 구조에 맞춤)
export interface MemoListResponseDto {
  data: Memo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 메모 목록 조회 파라미터
export interface MemoListParamsDto {
  page?: number;
  limit?: number;
  keyword?: string; // 검색 키워드 (제목 또는 내용)
  categoryId?: string;
  categoryIds?: string[]; // 다중 카테고리 필터링 지원 (클라이언트용)
  year?: number; // 년도로 필터링
  rating?: number;
  minRating?: number; // 최소 평점 (1.0~5.0)
  maxRating?: number; // 최대 평점 (1.0~5.0)
  hasRating?: boolean; // 별점 여부 필터 (false: 별점 없는 메모만, true: 별점 있는 메모만)
  sortBy?: 'createdAt' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// 별점 그룹 요약 (홈) — rating 5~1, 0 = 별점 없음
export interface RatingGroupSummary {
  rating: number;
  total: number;
  /** 최근 작성한 메모 (limit개까지) */
  memos: Memo[];
}

export interface RatingSummaryResponseDto {
  groups: RatingGroupSummary[];
}

export interface RatingSummaryParamsDto {
  categoryId?: string;
  year?: number;
  limit?: number;
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

// 메모 통계
export interface MemoStatsDto {
  totalMemos: number;
  totalCategories: number;
  averageRating: number;
  recentMemosCount: number;
}

// UI 메모 타입 정의
export interface UIMemo {
  id: string; // UUID 형태로 변경
  title: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  content: string;
  rating: number;
  timeAgo: string;
}
