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

// 알림 메모 타입
export interface NotificationMemo {
  id: string;
  title: string;
  content: string;
  reminderDate: Date;
  notificationId?: string;
  categoryId: string;
  category?: any;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isNotified?: boolean;
}

// 메모 생성 요청
export interface CreateMemoDto {
  title: string;
  content: string;
  categoryId: string; // UUID 형태
  rating: number;
  description?: string;
}

// 알림 메모 생성 요청
export interface CreateNotificationMemoDto {
  title: string;
  content: string;
  categoryId: string;
  reminderDate: Date;
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
  categoryIds?: string[]; // 다중 카테고리 필터링 지원
  rating?: number;
  sortBy?: 'createdAt' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
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
