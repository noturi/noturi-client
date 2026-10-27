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
