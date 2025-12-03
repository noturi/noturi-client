import { QUERY_KEYS } from '~/shared/lib';

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import {
  CalendarMemoListParamsDto,
  CalendarMemoMonthlyParamsDto,
} from '@/entities/calendar/model/types';

import { calendarMemoApi } from './api';

// 캘린더 메모 월별 조회 쿼리 (캘린더 뷰용)
export const calendarMemoMonthlyQuery = (params: CalendarMemoMonthlyParamsDto = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.calendarMemos[0], 'monthly', params],
    queryFn: () => calendarMemoApi.getByMonth(params),
  });

// 캘린더 메모 목록 쿼리 (목록 뷰용)
export const calendarMemoListQuery = (params: CalendarMemoListParamsDto = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.calendarMemos[0], 'list', params],
    queryFn: () => calendarMemoApi.getList(params),
  });

// 무한스크롤용 캘린더 메모 목록 쿼리
export const infiniteCalendarMemoListQuery = (
  params: Omit<CalendarMemoListParamsDto, 'page'> = {},
) =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.calendarMemosInfinite(params),
    queryFn: ({ pageParam = 1 }) => calendarMemoApi.getList({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.totalPages) return undefined;
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
  });

// 특정 캘린더 메모 쿼리
export const calendarMemoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.calendarMemo(id),
    queryFn: () => calendarMemoApi.getById(id),
    enabled: !!id,
  });
