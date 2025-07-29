// 카테고리 타입 정의
export interface Category {
  id: string; // UUID 형태로 변경
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  memoCount: number;
  createdAt: string;
  updatedAt: string;
}

// 카테고리 생성 요청
export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

// 카테고리 수정 요청
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: string;
}

// 카테고리 목록 응답
export interface CategoryListResponseDto {
  categories: Category[];
  total: number;
}

// 카테고리 목록 조회 파라미터
export interface CategoryListParamsDto {
  includeEmpty?: boolean; // 메모가 없는 카테고리 포함 여부
  sortBy?: "name" | "memoCount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// 카테고리 통계
export interface CategoryStatsDto {
  totalCategories: number;
  categoriesWithMemos: number;
  mostUsedCategory: Category | null;
  leastUsedCategory: Category | null;
  averageMemosPerCategory: number;
}

// 카테고리 순서 변경 요청
export interface ReorderCategoriesDto {
  categoryOrders: Array<{
    id: string;
    order: number;
  }>;
}

// 카테고리 병합 요청
export interface MergeCategoriesDto {
  sourceId: string;
  targetId: string;
}

// 카테고리별 메모 분포
export interface CategoryDistributionDto {
  categoryId: string;
  categoryName: string;
  memoCount: number;
  percentage: number;
  recentMemoCount: number; // 최근 7일 내 메모 수
}