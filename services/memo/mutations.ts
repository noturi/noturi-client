import {
  useMutation,
  useQueryClient,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { memoApi } from "./apis";
import {
  CreateMemoDto,
  UpdateMemoDto,
  BulkDeleteMemosDto,
  Memo,
} from "./types";

// 메모 생성 뮤테이션
export function useCreateMemoMutation(
  options: Pick<
    UseMutationOptions<Memo, DefaultError, CreateMemoDto>,
    "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > = {}
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["memo", "create", ...mutationKey],
    mutationFn: (data: CreateMemoDto) => memoApi.createMemo(data),
    onMutate,
    onSuccess: async (newMemo, createData, context) => {
      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ["memos"] });
      
      // 새로운 메모를 캐시에 추가
      queryClient.setQueryData(["memo", newMemo.id], newMemo);
      
      // 카테고리 목록도 무효화 (새 카테고리가 추가될 수 있음)
      await queryClient.invalidateQueries({ queryKey: ["memo-categories"] });
      
      // 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-stats"] });

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
    "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > = {}
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["memo", "update", ...mutationKey],
    mutationFn: (data: UpdateMemoDto) => memoApi.updateMemo(data),
    onMutate,
    onSuccess: async (updatedMemo, updateData, context) => {
      // 특정 메모 캐시 업데이트
      queryClient.setQueryData(["memo", updatedMemo.id], updatedMemo);
      
      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ["memos"] });
      
      // 카테고리가 변경되었을 수 있으므로 카테고리 목록도 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-categories"] });
      
      // 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-stats"] });

      await onSuccess?.(updatedMemo, updateData, context);
    },
    onError,
    onSettled,
  });
}

// 메모 삭제 뮤테이션
export function useDeleteMemoMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, number>,
    "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > = {}
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["memo", "delete", ...mutationKey],
    mutationFn: (id: number) => memoApi.deleteMemo(id),
    onMutate,
    onSuccess: async (_, deletedId, context) => {
      // 삭제된 메모의 캐시 제거
      queryClient.removeQueries({ queryKey: ["memo", deletedId] });
      
      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ["memos"] });
      
      // 카테고리 목록도 무효화 (카테고리가 비어있을 수 있음)
      await queryClient.invalidateQueries({ queryKey: ["memo-categories"] });
      
      // 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-stats"] });

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
    "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled"
  > = {}
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["memo", "bulk-delete", ...mutationKey],
    mutationFn: (data: BulkDeleteMemosDto) => memoApi.bulkDeleteMemos(data),
    onMutate,
    onSuccess: async (_, deleteData, context) => {
      // 삭제된 메모들의 캐시 제거
      deleteData.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: ["memo", id] });
      });
      
      // 메모 목록 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: ["memos"] });
      
      // 카테고리 목록도 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-categories"] });
      
      // 통계 무효화
      await queryClient.invalidateQueries({ queryKey: ["memo-stats"] });

      await onSuccess?.(_, deleteData, context);
    },
    onError,
    onSettled,
  });
}