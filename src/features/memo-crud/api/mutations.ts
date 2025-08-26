import {
  BulkDeleteMemosDto,
  CreateMemoDto,
  Memo,
  UpdateMemoDto,
} from '~/entities/memo/model/types';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { memoApi } from './apis';

// 메모 생성 뮤테이션
export function useCreateMemoMutation(
  options: Pick<
    UseMutationOptions<Memo, DefaultError, CreateMemoDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['memo', 'create', ...mutationKey],
    mutationFn: (data: CreateMemoDto) => memoApi.createMemo(data),
    onMutate,
    onSuccess: async (newMemo, createData, context) => {
      // 메모 목록 캐시 무효화 - 파라미터 상관없이 모든 메모 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: ['memos'],
        exact: false, // 하위 키도 모두 무효화
      });

      // 새로 생성된 메모를 캐시에 저장
      queryClient.setQueryData(['memo', newMemo.id], newMemo);

      // 카테고리 관련 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-stats'],
        exact: false,
      });

      await onSuccess?.(newMemo, createData, context);
    },
    onError,
    onSettled,
  });
}

// 메모 수정 뮤테이션
export function useUpdateMemoMutation(
  options: Pick<
    UseMutationOptions<Memo, DefaultError, UpdateMemoDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['memo', 'update', ...mutationKey],
    mutationFn: (data: UpdateMemoDto) => memoApi.updateMemo(data),
    onMutate,
    onSuccess: async (updatedMemo, updateData, context) => {
      // 특정 메모 캐시 업데이트
      queryClient.setQueryData(['memo', updatedMemo.id], updatedMemo);

      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['memos'],
        exact: false,
      });

      // 카테고리 관련 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-stats'],
        exact: false,
      });

      await onSuccess?.(updatedMemo, updateData, context);
    },
    onError,
    onSettled,
  });
}

// 메모 삭제 뮤테이션
export function useDeleteMemoMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['memo', 'delete', ...mutationKey],
    mutationFn: (id: string) => memoApi.deleteMemo(id),
    onMutate,
    onSuccess: async (_, deletedId, context) => {
      // 삭제된 메모의 캐시 제거
      queryClient.removeQueries({ queryKey: ['memo', deletedId] });

      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['memos'],
        exact: false,
      });

      // 카테고리 관련 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-stats'],
        exact: false,
      });

      await onSuccess?.(_, deletedId, context);
    },
    onError,
    onSettled,
  });
}

// 메모 일괄 삭제 뮤테이션
export function useBulkDeleteMemosMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, BulkDeleteMemosDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['memo', 'bulk-delete', ...mutationKey],
    mutationFn: (data: BulkDeleteMemosDto) => memoApi.bulkDeleteMemos(data),
    onMutate,
    onSuccess: async (_, deleteData, context) => {
      // 삭제된 메모들의 캐시 제거
      deleteData.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: ['memo', id] });
      });

      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['memos'],
        exact: false,
      });

      // 카테고리 관련 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-categories'],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ['memo-stats'],
        exact: false,
      });

      await onSuccess?.(_, deleteData, context);
    },
    onError,
    onSettled,
  });
}
