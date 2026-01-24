import { CreateTodoDto, Todo } from '~/entities/todo/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

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
      // 관련 캐시 무효화
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['todos'],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.todosWeeklyStats,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.todosOverviewStats,
        }),
      ]);

      await onSuccess?.(newTodo, createData, context);
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
      // 관련 캐시 무효화
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['todos'],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.todosWeeklyStats,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.todosOverviewStats,
        }),
      ]);

      await onSuccess?.(updatedTodo, id, context);
    },
    onError: (error, id, context) => {
      console.error('Todo toggle error:', error);
      onError?.(error, id, context);
    },
    onSettled,
  });
}
