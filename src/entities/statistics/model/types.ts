// 별점 분포 정보
export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

// 카테고리별 패턴 정보
export interface CategoryPattern {
  category: string;
  avgRating: number;
  pattern: string;
}

// 트렌드 분석 응답
export interface TrendsResponseDto {
  ratingDistribution: RatingDistribution[];
  categoryPatterns: CategoryPattern[];
}

// 트렌드 분석 요청 파라미터
export interface TrendsParamsDto {
  year?: number;
  month?: number;
}

// 전체 통계 정보
export interface OverallStats {
  totalMemos: number;
  avgRating: number;
  totalCategories: number;
  bestExperiences: number;
  recommendedExperiences: number;
  avoidExperiences: number;
}

// 전체 통계 요청 파라미터
export interface OverallStatsParamsDto {
  year?: number;
  month?: number;
}

// 서버에서 오는 카테고리별 통계 응답
export interface CategoryStatsResponse {
  name: string;
  count: number;
  avgRating: number;
}

// UI에서 사용하는 카테고리별 통계 (색상, 설명 추가)
export interface CategoryStats {
  name: string;
  count: number;
  avgRating: number;
  color: string;
  description: string;
}
