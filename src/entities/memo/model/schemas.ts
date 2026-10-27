import { z } from 'zod';

import type { Memo, MemoListResponseDto } from './types';

export const memoFormSchema = z.object({
  text: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(2100, '내용은 2100자 이하로 입력해주세요')
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
  categoryId: z.string(),
  rating: z.number(),
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
