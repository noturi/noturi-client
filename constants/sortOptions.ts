import type { SortOption } from "@/app/(tabs)/_components/types";

export const INITIAL_SORT_OPTIONS: SortOption[] = [
  { name: "최신순", active: true },
  { name: "별점순", active: false },
];

export const SORT_TYPE_MAP = {
  최신순: "createdAt",
  별점순: "rating",
} as const;

export type SortType = (typeof SORT_TYPE_MAP)[keyof typeof SORT_TYPE_MAP];
