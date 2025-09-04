import type { MemoListResponseDto, UIMemo } from '~/entities/memo/model/types';
import { MemoService } from '~/features/memo/lib/memoService';

import { useMemo } from 'react';

import type { InfiniteData } from '@tanstack/react-query';

export function useTransformMemos(data: InfiniteData<MemoListResponseDto> | undefined): UIMemo[] {
  return useMemo(() => {
    if (!data?.pages) return [];
    const allMemos = data.pages.flatMap((page) => page.data);
    return MemoService.transformToUIMemos(allMemos);
  }, [data]);
}
