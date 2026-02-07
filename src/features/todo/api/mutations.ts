import { CreateTodoDto, Todo, UpdateTodoDto } from '~/entities/todo/model/types';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { invalidateTodoCache } from '../lib/invalidate-todo-cache';
import { todoMutationApi } from './apis';

/**
 * Feature Layer - CUD 전용 React Query Mutations
 *
 * 이 파일은 투두 피처의 변경용 Mutation만 정의합니다.
 * - ✅ useMutation 관련 hooks만 사용
 * - ❌ useQuery는 entities/todo/api/queries.ts에서 처리
 */

// 투두 생성 뮤테이션
export function useCreateTodoMutation(
  options: Pick<
    UseMutationOptions<Todo, DefaultError, CreateTodoDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'create', ...mutationKey],
    mutationFn: (data: CreateTodoDto) => todoMutationApi.createTodo(data),
    onMutate,
    onSuccess: async (newTodo, createData, context) => {
      await invalidateTodoCache(queryClient);
      await onSuccess?.(newTodo, createData, context);
    },
    onError,
    onSettled,
  });
}

// 투두 수정 뮤테이션
export function useUpdateTodoMutation(
  options: Pick<
    UseMutationOptions<Todo, DefaultError, { id: string; data: UpdateTodoDto }>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'update', ...mutationKey],
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoDto }) =>
      todoMutationApi.updateTodo(id, data),
    onMutate,
    onSuccess: async (updatedTodo, variables, context) => {
      await invalidateTodoCache(queryClient);
      await onSuccess?.(updatedTodo, variables, context);
    },
    onError,
    onSettled,
  });
}

// 투두 삭제 뮤테이션
export function useDeleteTodoMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'delete', ...mutationKey],
    mutationFn: (id: string) => todoMutationApi.deleteTodo(id),
    onMutate,
    onSuccess: async (result, id, context) => {
      await invalidateTodoCache(queryClient);
      await onSuccess?.(result, id, context);
    },
    onError,
    onSettled,
  });
}

// 투두 완료 토글 뮤테이션
export function useToggleTodoMutation(
  options: Pick<
    UseMutationOptions<Todo, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'toggle', ...mutationKey],
    mutationFn: (id: string) => todoMutationApi.toggleTodo(id),
    onMutate,
    onSuccess: async (updatedTodo, id, context) => {
      await invalidateTodoCache(queryClient);
      await onSuccess?.(updatedTodo, id, context);
    },
    onError,
    onSettled,
  });
}
