import { z } from 'zod';

// GET categories 백엔드 원본 응답 (Category로 변환 전)
export const backendCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  count: z.object({ memos: z.number() }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const backendCategoryListSchema = z.array(backendCategorySchema);

export type BackendCategory = z.infer<typeof backendCategorySchema>;

// 카테고리 생성 폼
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '카테고리 이름을 입력해주세요.')
    .max(20, '카테고리 이름은 20자 이하로 입력해주세요'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
