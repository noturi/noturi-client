import type { SortOption } from "@/lib/category/types";

export const INITIAL_SORT_OPTIONS: SortOption[] = [
  { name: "최신", active: true },
  { name: "평점", active: false },
];

export const SORT_TYPE_MAP = {
  최신: "createdAt",
  평점: "rating",
} as const;

export type SortType = (typeof SORT_TYPE_MAP)[keyof typeof SORT_TYPE_MAP];
