import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { categoryApi } from './apis';
import {
  Category,
  CreateCategoryDto,
  MergeCategoriesDto,
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from './types';

// 카테고리 생성 뮤테이션
export function useCreateCategoryMutation(
  options: Pick<
    UseMutationOptions<Category, DefaultError, CreateCategoryDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'create', ...mutationKey],
    mutationFn: (data: CreateCategoryDto) => categoryApi.createCategory(data),
    onMutate,
    onSuccess: async (newCategory, createData, context) => {
      // 카테고리 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ['categories'] });

      // 새로운 카테고리를 캐시에 추가
      queryClient.setQueryData(['category', newCategory.id], newCategory);

      // 카테고리 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-stats'] });

      // 카테고리 분포 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-distribution'] });

      await onSuccess?.(newCategory, createData, context);
    },
    onError,
    onSettled,
  });
}

// 카테고리 수정 뮤테이션
export function useUpdateCategoryMutation(
  options: Pick<
    UseMutationOptions<Category, DefaultError, UpdateCategoryDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'update', ...mutationKey],
    mutationFn: (data: UpdateCategoryDto) => categoryApi.updateCategory(data),
    onMutate,
    onSuccess: async (updatedCategory, updateData, context) => {
      // 특정 카테고리 캐시 업데이트
      queryClient.setQueryData(['category', updatedCategory.id], updatedCategory);

      // 카테고리 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ['categories'] });

      // 카테고리 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-stats'] });

      // 메모 목록도 무효화 (카테고리 이름이 변경될 수 있음)
      await queryClient.invalidateQueries({ queryKey: ['memos'] });

      await onSuccess?.(updatedCategory, updateData, context);
    },
    onError,
    onSettled,
  });
}

// 카테고리 삭제 뮤테이션
export function useDeleteCategoryMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'delete', ...mutationKey],
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onMutate,
    onSuccess: async (_, deletedId, context) => {
      // 삭제된 카테고리의 캐시 제거
      queryClient.removeQueries({ queryKey: ['category', deletedId] });

      // 카테고리 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ['categories'] });

      // 카테고리 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-stats'] });

      // 카테고리 분포 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-distribution'] });

      // 메모 목록도 무효화 (해당 카테고리의 메모들이 영향받을 수 있음)
      await queryClient.invalidateQueries({ queryKey: ['memos'] });

      await onSuccess?.(_, deletedId, context);
    },
    onError,
    onSettled,
  });
}

// 카테고리 순서 변경 뮤테이션
export function useReorderCategoriesMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, ReorderCategoriesDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'reorder', ...mutationKey],
    mutationFn: (data: ReorderCategoriesDto) => categoryApi.reorderCategories(data),
    onMutate,
    onSuccess: async (_, reorderData, context) => {
      // 카테고리 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ['categories'] });

      await onSuccess?.(_, reorderData, context);
    },
    onError,
    onSettled,
  });
}

// 카테고리 병합 뮤테이션
export function useMergeCategoriesMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, MergeCategoriesDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'merge', ...mutationKey],
    mutationFn: (data: MergeCategoriesDto) => categoryApi.mergeCategories(data),
    onMutate,
    onSuccess: async (_, mergeData, context) => {
      // 원본 카테고리 캐시 제거
      queryClient.removeQueries({ queryKey: ['category', mergeData.sourceId] });

      // 타겟 카테고리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['category', mergeData.targetId] });

      // 카테고리 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ['categories'] });

      // 카테고리 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-stats'] });

      // 카테고리 분포 무효화
      await queryClient.invalidateQueries({ queryKey: ['category-distribution'] });

      // 메모 목록도 무효화 (메모들의 카테고리가 변경됨)
      await queryClient.invalidateQueries({ queryKey: ['memos'] });

      await onSuccess?.(_, mergeData, context);
    },
    onError,
    onSettled,
  });
}
