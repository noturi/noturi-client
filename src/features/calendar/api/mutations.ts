import { CreateCalendarMemoDto } from '~/entities/calendar-memo/model/types';
import { QUERY_KEYS } from '~/shared/lib';

import { useMutation, useQueryClient } from '@tanstack/react-query';

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
