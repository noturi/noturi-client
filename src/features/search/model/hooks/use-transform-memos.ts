import { type MemoListResponseDto, type UIMemo, toUIMemos } from '~/entities/memo';

import type { InfiniteData } from '@tanstack/react-query';

// 메모이제이션은 React Compiler가 담당
export function useTransformMemos(data: InfiniteData<MemoListResponseDto> | undefined): UIMemo[] {
  return toUIMemos(data?.pages.flatMap((page) => page.data));
}
