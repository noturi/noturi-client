import { QUERY_KEYS } from '~/shared/lib';

import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { MemoListParamsDto } from '../model/types';
import { memoApi } from './apis';

// 무한스크롤용 메모 목록 쿼리
export const infiniteMemoListQuery = (params: Omit<MemoListParamsDto, 'page'> = {}) =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.memosInfinite(params),
    queryFn: ({ pageParam = 1 }) => memoApi.getMemos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.page || !lastPage?.totalPages) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

// 특정 메모 쿼리
export const memoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.memo(id),
    queryFn: () => memoApi.getMemo(id),
    enabled: !!id, // id가 있을 때만 실행
  });
