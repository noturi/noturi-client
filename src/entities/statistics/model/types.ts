import { z } from 'zod';

// 별점 분포 정보 스키마
export const RatingDistributionSchema = z.object({
  rating: z.number(),
  count: z.number(),
  percentage: z.number(),
});

// 카테고리별 패턴 정보 스키마
export const CategoryPatternSchema = z.object({
  category: z.string(),
  avgRating: z.number(),
  pattern: z.string(),
});

// 트렌드 분석 응답 스키마
export const TrendsResponseDtoSchema = z.object({
  ratingDistribution: z.array(RatingDistributionSchema),
  categoryPatterns: z.array(CategoryPatternSchema),
});

// 트렌드 분석 요청 파라미터 스키마
export const TrendsParamsDtoSchema = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
});

// 전체 통계 정보 스키마
export const OverallStatsSchema = z.object({
  totalMemos: z.number(),
  avgRating: z.number(),
  totalCategories: z.number(),
  bestExperiences: z.number(),
  recommendedExperiences: z.number(),
  avoidExperiences: z.number(),
});

// 전체 통계 요청 파라미터 스키마
export const OverallStatsParamsDtoSchema = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
});

// 서버에서 오는 카테고리별 통계 응답 스키마
export const CategoryStatsResponseSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  color: z.string(),
});

// UI에서 사용하는 카테고리별 통계 스키마
export const CategoryStatsSchema = z.object({
  name: z.string(),
  count: z.number(),
  avgRating: z.number(),
  color: z.string(),
  description: z.string(),
});

// Zod 스키마에서 타입 추출
export type RatingDistribution = z.infer<typeof RatingDistributionSchema>;
export type CategoryPattern = z.infer<typeof CategoryPatternSchema>;
export type TrendsResponseDto = z.infer<typeof TrendsResponseDtoSchema>;
export type TrendsParamsDto = z.infer<typeof TrendsParamsDtoSchema>;
export type OverallStats = z.infer<typeof OverallStatsSchema>;
export type OverallStatsParamsDto = z.infer<typeof OverallStatsParamsDtoSchema>;
export type CategoryStatsResponseDto = z.infer<typeof CategoryStatsResponseSchema>;
export type CategoryStats = z.infer<typeof CategoryStatsSchema>;
