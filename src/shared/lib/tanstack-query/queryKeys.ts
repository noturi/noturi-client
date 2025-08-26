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
  category: (id: number) => ['category', id] as const,
  categoriesAll: ['categories', 'all'] as const,
  categoriesActive: ['categories', 'active'] as const,
  categoriesUnused: ['categories', 'unused'] as const,
  categoriesSearch: (query: string) => ['categories', 'search', query] as const,
  categoriesByName: ['categories', 'sorted', 'name'] as const,
  categoriesByMemoCount: ['categories', 'sorted', 'memoCount'] as const,
  categoriesByCreatedDate: ['categories', 'sorted', 'createdAt'] as const,
  categoryCheckExists: (name: string) => ['category', 'check-exists', name] as const,
  memoCategories: ['memo-categories'] as const,

  // 통계
  memoStats: ['memo-stats'] as const,
  categoryStats: ['category-stats'] as const,
  categoryDistribution: ['category-distribution'] as const,
} as const;
