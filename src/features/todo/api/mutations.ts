import {
  CreateTodoDto,
  Todo,
  TodoListResponseDto,
  TodoToggleResponseDto,
  UpdateTodoDto,
} from '~/entities/todo/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { invalidateTodoByDate, invalidateTodoStats } from '../lib/invalidate-todo-cache';
import { todoMutationApi } from './apis';

/**
 * Feature Layer - CUD 전용 React Query Mutations
 *
 * 캐시 전략:
 * - toggle: 수동 캐시 업데이트 (서버 응답의 dailyStats 활용) + 통계만 무효화
 * - create/delete: 해당 날짜 쿼리 + 통계 무효화
 * - update: 해당 날짜 쿼리 + 통계 무효화
 */

type MutationCallbacks<TData, TVariables> = Pick<
  UseMutationOptions<TData, DefaultError, TVariables>,
  'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
>;

// 투두 생성
export function useCreateTodoMutation(options: MutationCallbacks<Todo, CreateTodoDto> = {}) {
  const { onSuccess, ...rest } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'create'],
    mutationFn: (data: CreateTodoDto) => todoMutationApi.createTodo(data),
    onSuccess: async (newTodo, createData, context) => {
      await invalidateTodoByDate(queryClient, createData.date);
      await onSuccess?.(newTodo, createData, context);
    },
    ...rest,
  });
}

// 투두 수정
export function useUpdateTodoMutation(
  options: MutationCallbacks<Todo, { id: string; data: UpdateTodoDto }> = {},
) {
  const { onSuccess, ...rest } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'update'],
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoDto }) =>
      todoMutationApi.updateTodo(id, data),
    onSuccess: async (updatedTodo, variables, context) => {
      const dateStr = updatedTodo.date.split('T')[0];
      await invalidateTodoByDate(queryClient, dateStr);
      await onSuccess?.(updatedTodo, variables, context);
    },
    ...rest,
  });
}

// 투두 삭제
export function useDeleteTodoMutation(options: MutationCallbacks<void, string> = {}) {
  const { onSuccess, ...rest } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'delete'],
    mutationFn: (id: string) => todoMutationApi.deleteTodo(id),
    onSuccess: async (result, id, context) => {
      // 삭제는 어떤 날짜인지 모르므로 활성 쿼리 전체 무효화
      await queryClient.invalidateQueries({
        queryKey: ['todos', 'date'],
        exact: false,
      });
      await invalidateTodoStats(queryClient);
      await onSuccess?.(result, id, context);
    },
    ...rest,
  });
}

// 투두 완료 토글 (수동 캐시 업데이트 + 통계만 무효화)
export function useToggleTodoMutation(
  options: MutationCallbacks<TodoToggleResponseDto, string> = {},
) {
  const { onSuccess, ...rest } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todo', 'toggle'],
    mutationFn: (id: string) => todoMutationApi.toggleTodo(id),
    onSuccess: async (response, id, context) => {
      const { dailyStats, ...updatedTodo } = response;
      const dateStr = updatedTodo.date.split('T')[0];

      // 서버 응답으로 즉시 캐시 업데이트 (refetch 불필요)
      queryClient.setQueriesData<TodoListResponseDto>(
        { queryKey: QUERY_KEYS.todosByDate(dateStr) },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            rate: dailyStats.rate,
            data: old.data.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
          };
        },
      );

      // 통계만 무효화 (todo 목록은 이미 수동 업데이트됨)
      await invalidateTodoStats(queryClient);
      await onSuccess?.(response, id, context);
    },
    ...rest,
  });
}
