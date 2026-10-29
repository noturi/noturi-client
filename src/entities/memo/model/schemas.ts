import { z } from 'zod';

import type { Memo, MemoListResponseDto, RatingSummaryResponseDto } from './types';

/** 서버 제한과 같게 (CreateMemoDto @MaxLength) */
export const MEMO_TITLE_MAX_LENGTH = 100;
export const MEMO_CONTENT_MAX_LENGTH = 5000;

export const memoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요')
    .max(MEMO_TITLE_MAX_LENGTH, `제목은 ${MEMO_TITLE_MAX_LENGTH}자 이하로 입력해주세요`),
  content: z
    .string()
    .max(MEMO_CONTENT_MAX_LENGTH, `메모는 ${MEMO_CONTENT_MAX_LENGTH}자 이하로 입력해주세요`)
    .transform((val) => val.trim()),
  selectedCategory: z.string().optional(),
  rating: z.number().min(0).max(5),
});

export type MemoFormData = z.infer<typeof memoFormSchema>;

// API 응답 스키마 — 타입과 어긋나면 컴파일 에러가 나도록 z.ZodType<...>으로 고정
export const memoSchema: z.ZodType<Memo> = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.object({ id: z.string(), name: z.string(), color: z.string() }).nullable(),
  categoryId: z.string().nullable(),
  // 서버 Decimal 컬럼이 JSON 문자열("4.5")로 직렬화됨 → 경계에서 숫자로 정규화
  rating: z.coerce.number(),
  description: z.string().optional(),
  experienceDate: z.string().nullable().optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const memoListResponseSchema: z.ZodType<MemoListResponseDto> = z.object({
  data: z.array(memoSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const ratingSummaryResponseSchema: z.ZodType<RatingSummaryResponseDto> = z.object({
  groups: z.array(
    z.object({
      rating: z.number(),
      total: z.number(),
      memos: z.array(memoSchema),
    }),
  ),
});
