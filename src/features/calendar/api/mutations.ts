import {
  CalendarMemo,
  CreateCalendarMemoDto,
  UpdateCalendarMemoDto,
} from '~/entities/calendar/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import {
  type DefaultError,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { calendarApi } from './api';

// 캘린더 메모 생성 뮤테이션
export const useCreateCalendarMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarMemoDto) => calendarApi.createCalendarMemo(data),
    onSuccess: () => {
      // 캘린더 메모 쿼리들 무효화하여 최신 데이터 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.calendarMemos[0]],
      });
    },
    onError: (error) => {
      console.error('캘린더 메모 생성 실패:', error);
    },
  });
};

// 캘린더 메모 수정 뮤테이션
export function useUpdateCalendarMemo(
  options: Pick<
    UseMutationOptions<CalendarMemo, DefaultError, UpdateCalendarMemoDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['calendar-memo', 'update', ...mutationKey],
    mutationFn: (data: UpdateCalendarMemoDto) => {
      const { id, ...updateData } = data;
      return calendarApi.updateCalendarMemo(id, updateData);
    },
    onMutate,
    onSuccess: async (_, updatedData, context) => {
      // 캘린더 메모 목록 쿼리들 무효화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.calendarMemos[0]],
      });

      await onSuccess?.(_, updatedData, context);
    },
    onError,
    onSettled,
  });
}

// 캘린더 메모 삭제 뮤테이션
export function useDeleteCalendarMemo(
  options: Pick<
    UseMutationOptions<void, DefaultError, string>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['calendar-memo', 'delete', ...mutationKey],
    mutationFn: (id: string) => calendarApi.deleteCalendarMemo(id),
    onMutate,
    onSuccess: async (_, deletedId, context) => {
      // 삭제된 캘린더 메모의 캐시 제거
      queryClient.removeQueries({ queryKey: ['calendar-memo', deletedId] });

      // 캘린더 메모 목록 쿼리들 무효화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.calendarMemos[0]],
      });

      await onSuccess?.(_, deletedId, context);
    },
    onError,
    onSettled,
  });
}
