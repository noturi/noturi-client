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
export const OverallStatsResponseDtoSchema = z.object({
  totalMemos: z.number(),
  totalCategories: z.number(),
  thisMonthMemos: z.number(),
  lastMonthMemos: z.number(),
  growthRate: z.number(),
  averageRating: z.number(),
  dailyAverage: z.number(),
  lastMemoDate: z.string(),
  activeDaysThisMonth: z.number(),
});

// 전체 통계 요청 파라미터 스키마
export const OverallStatsParamsDtoSchema = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
});

export const CategoryStatsResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  count: z.number(),
  percentage: z.number(),
  averageRating: z.number(),
  lastMemoDate: z.string(),
  thisMonthCount: z.number(),
});

// Zod 스키마에서 타입 추출
export type RatingDistribution = z.infer<typeof RatingDistributionSchema>;
export type CategoryPattern = z.infer<typeof CategoryPatternSchema>;
export type TrendsResponseDto = z.infer<typeof TrendsResponseDtoSchema>;
export type TrendsParamsDto = z.infer<typeof TrendsParamsDtoSchema>;
export type OverallStatsResponseDto = z.infer<typeof OverallStatsResponseDtoSchema>;
export type OverallStatsParamsDto = z.infer<typeof OverallStatsParamsDtoSchema>;
export type CategoryStatsResponseDto = z.infer<typeof CategoryStatsResponseDtoSchema>;
