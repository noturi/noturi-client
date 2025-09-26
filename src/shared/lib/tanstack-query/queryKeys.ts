export const QUERY_KEYS = {
  // 메모 관련
  memos: ['memos'] as const,
  memo: (id: string) => ['memo', id] as const,
  memosInfinite: (params: Record<string, unknown>) => ['memos', 'infinite', params] as const,
  memosRecent: (limit: number) => ['memos', 'recent', limit] as const,
  memosSearch: (query: string) => ['memos', 'search', query] as const,
  memosByCategory: (categoryId: string, params: Record<string, unknown>) =>
    ['memos', 'category', categoryId, params] as const,

  // 카테고리 관련
  categories: ['categories'] as const,
  category: (id: string) => ['category', id] as const,
  categoriesAll: ['categories', 'all'] as const,
  categoriesActive: ['categories', 'active'] as const,
  categoriesUnused: ['categories', 'unused'] as const,
  categoriesSearch: (query: string) => ['categories', 'search', query] as const,
  categoriesByName: ['categories', 'sorted', 'name'] as const,
  categoriesByMemoCount: ['categories', 'sorted', 'memoCount'] as const,
  categoriesByCreatedDate: ['categories', 'sorted', 'createdAt'] as const,
  categoryCheckExists: (name: string) => ['category', 'check-exists', name] as const,

  // 캘린더 메모 관련
  calendarMemos: ['calendar-memos'] as const,
  calendarMemo: (id: string) => ['calendar-memo', id] as const,
  calendarMemosInfinite: (params: Record<string, unknown>) =>
    ['calendar-memos', 'infinite', params] as const,

  // 통계
  statisticsMemos: ['statistics', 'memos'] as const,
  statisticsCategories: ['statistics', 'categories'] as const,
  statisticsCategoryDistribution: ['statistics', 'category-distribution'] as const,
  statisticsTrends: (params: Record<string, unknown>) => ['statistics', 'trends', params] as const,
  statisticsOverall: (params: Record<string, unknown>) =>
    ['statistics', 'overall', params] as const,
} as const;
