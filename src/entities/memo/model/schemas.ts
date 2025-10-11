import { z } from 'zod';

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

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, '카테고리 이름을 입력해주세요')
    .max(20, '카테고리 이름은 20자 이하로 입력해주세요')
    .transform((val) => val.trim()),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
