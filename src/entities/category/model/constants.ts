import type { CreateCategoryDto } from './types';

// 카테고리 색상 팔레트 — 사용자 데이터로 저장되는 고정 색상 (테마와 무관)
export const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
] as const;

export const DEFAULT_CATEGORIES: CreateCategoryDto[] = [
  { name: '일상', color: CATEGORY_COLORS[0], icon: 'home' },
  { name: '업무', color: CATEGORY_COLORS[1], icon: 'briefcase' },
  { name: '학습', color: CATEGORY_COLORS[2], icon: 'book' },
  { name: '운동', color: CATEGORY_COLORS[3], icon: 'activity' },
  { name: '독서', color: CATEGORY_COLORS[4], icon: 'book-open' },
];

export const CATEGORY_ICONS = [
  'folder',
  'tag',
  'bookmark',
  'star',
  'heart',
  'home',
  'briefcase',
  'book',
  'activity',
  'music',
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];
