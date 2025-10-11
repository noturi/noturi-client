import {
  Category,
  CreateCategoryDto,
  MergeCategoriesDto,
  ReorderCategoriesDto,
  UpdateCategoryDto,
} from '~/entities/category/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { categoryApi } from './apis';

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
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      await queryClient.setQueryData(QUERY_KEYS.category(newCategory.id), newCategory);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategoryDistribution });
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
      await queryClient.setQueryData(QUERY_KEYS.category(updatedCategory.id), updatedCategory);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memos });
      await onSuccess?.(updatedCategory, updateData, context);
    },
    onError,
    onSettled,
  });
}

// 카테고리 삭제 뮤테이션
export function useDeleteCategoryMutation(
  options?: Pick<
    UseMutationOptions<void, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >,
) {
  const { mutationKey = [], onMutate, onSuccess, onSettled } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'delete', ...mutationKey],
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onMutate,
    onSuccess: async (_, deletedId, context) => {
      await queryClient.removeQueries({ queryKey: QUERY_KEYS.category(deletedId) });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategoryDistribution });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memos });

      await onSuccess?.(_, deletedId, context);
    },
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
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });

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
  const { mutationKey = [], onMutate, onSuccess, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['category', 'merge', ...mutationKey],
    mutationFn: (data: MergeCategoriesDto) => categoryApi.mergeCategories(data),
    onMutate,
    onSuccess: async (_, mergeData, context) => {
      await queryClient.removeQueries({ queryKey: QUERY_KEYS.category(mergeData.sourceId) });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(mergeData.targetId) });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategories });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statisticsCategoryDistribution });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memos });

      await onSuccess?.(_, mergeData, context);
    },
    onSettled,
  });
}
