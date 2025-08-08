import type { MemoListResponseDto } from "@/services/memo";
import { MemoService } from "@/services/memo";
import type { UIMemo } from "@/services/memo/memoService";
import type { InfiniteData } from "@tanstack/react-query";
import { useMemo } from "react";

export function useTransformMemos(
  data: InfiniteData<MemoListResponseDto> | undefined
): UIMemo[] {
  return useMemo(() => {
    if (!data?.pages) return [];
    const allMemos = data.pages.flatMap((page) => page.data);
    return MemoService.transformToUIMemos(allMemos);
  }, [data]);
}
