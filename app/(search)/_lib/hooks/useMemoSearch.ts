import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { activeCategoriesQuery } from '@/services/category';
import type { UIMemo } from '@/services/memo/memoService';

import { useInfiniteMemos } from './useInfiniteMemos';
import { useSearchFilters } from './useSearchFilters';
import { useTransformMemos } from './useTransformMemos';

interface FiltersNamespace {
  // state
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedRating: number | undefined;
  setSelectedRating: (rating: number | undefined) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  clearAll: () => void;
  // derived
  debouncedSearchText: string;
  hasActiveFilters: boolean;
  hasSearchQuery: boolean;
}

interface CategoriesNamespace {
  list: { id: string; name: string; color?: string; icon?: string }[];
}

interface MemosNamespace {
  list: UIMemo[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  refetch: () => void;
}

export interface UseMemoSearchReturn {
  filters: FiltersNamespace;
  categories: CategoriesNamespace;
  memos: MemosNamespace;
}

export function useMemoSearch(): UseMemoSearchReturn {
  const {
    searchText,
    setSearchText,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedRating,
    setSelectedRating,
    showFilters,
    setShowFilters,
    toggleFilters,
    clearAll,
    debouncedSearchText,
    hasActiveFilters,
    hasSearchQuery,
  } = useSearchFilters();

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categoriesList = categoriesData?.categories ?? [];

  const enabled = hasSearchQuery;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteMemos({
      debouncedSearchText,
      selectedCategoryId,
      selectedRating,
      enabled,
    });

  const transformedMemos = useTransformMemos(data);

  const wrappedFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const wrappedRefetch = useCallback(() => {
    if (hasSearchQuery) {
      refetch();
    }
  }, [hasSearchQuery, refetch]);

  return {
    filters: {
      searchText,
      setSearchText,
      selectedCategoryId,
      setSelectedCategoryId,
      selectedRating,
      setSelectedRating,
      showFilters,
      setShowFilters,
      toggleFilters,
      clearAll,
      debouncedSearchText,
      hasActiveFilters,
      hasSearchQuery,
    },
    categories: {
      list: categoriesList,
    },
    memos: {
      list: transformedMemos,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage: wrappedFetchNextPage,
      refetch: wrappedRefetch,
    },
  };
}
