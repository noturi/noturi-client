import { type MemoListResponseDto, type UIMemo, toUIMemos } from '~/entities/memo';

import { useMemo } from 'react';

import type { InfiniteData } from '@tanstack/react-query';

export function useTransformMemos(data: InfiniteData<MemoListResponseDto> | undefined): UIMemo[] {
  return useMemo(() => {
    if (!data?.pages) return [];
    const allMemos = data.pages.flatMap((page) => page.data);
    return toUIMemos(allMemos);
  }, [data]);
}
