import { CreateMemoDto, Memo, UpdateMemoDto } from '~/entities/memo';
import { QUERY_KEYS } from '~/shared/lib';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { invalidateMemoRelatedCache } from '../lib/invalidate-memo-cache';
import { memoMutationApi } from './apis';

/**
 * Feature Layer - CUD 전용 React Query Mutations
 *
 * 이 파일은 메모 피처의 변경용 Mutation만 정의합니다.
 * - ✅ useMutation 관련 hooks만 사용
 * - ❌ useQuery는 entities/memo/api/queries.ts에서 처리
 */

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
    mutationFn: (data: CreateMemoDto) => memoMutationApi.createMemo(data),
    onMutate,
    onSuccess: async (newMemo, createData, onMutateResult, context) => {
      // 새로 생성된 메모를 캐시에 저장
      queryClient.setQueryData(QUERY_KEYS.memo(newMemo.id), newMemo);

      await invalidateMemoRelatedCache(queryClient);

      await onSuccess?.(newMemo, createData, onMutateResult, context);
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
    mutationFn: (data: UpdateMemoDto) => memoMutationApi.updateMemo(data),
    onMutate,
    onSuccess: async (updatedMemo, updateData, onMutateResult, context) => {
      // 특정 메모 캐시 업데이트
      queryClient.setQueryData(QUERY_KEYS.memo(updatedMemo.id), updatedMemo);

      await invalidateMemoRelatedCache(queryClient);

      await onSuccess?.(updatedMemo, updateData, onMutateResult, context);
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
    mutationFn: (id: string) => memoMutationApi.deleteMemo(id),
    onMutate,
    onSuccess: async (_, deletedId, onMutateResult, context) => {
      // 삭제된 메모의 캐시 제거
      queryClient.removeQueries({ queryKey: QUERY_KEYS.memo(deletedId) });

      await invalidateMemoRelatedCache(queryClient);

      await onSuccess?.(_, deletedId, onMutateResult, context);
    },
    onError,
    onSettled,
  });
}
