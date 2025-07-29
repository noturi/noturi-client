import type { CreateCategoryDto } from "@/services/category/types";

export const DEFAULT_CATEGORIES: CreateCategoryDto[] = [
  { name: "일상", color: "#3B82F6", icon: "home" },
  { name: "업무", color: "#EF4444", icon: "briefcase" },
  { name: "학습", color: "#10B981", icon: "book" },
  { name: "운동", color: "#F59E0B", icon: "activity" },
  { name: "독서", color: "#8B5CF6", icon: "book-open" },
];

export const CATEGORY_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#84CC16", // Lime
] as const;

export const CATEGORY_ICONS = [
  "folder",
  "tag",
  "bookmark",
  "star",
  "heart",
  "home",
  "briefcase",
  "book",
  "activity",
  "music",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];
