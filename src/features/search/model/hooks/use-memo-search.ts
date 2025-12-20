import type { UIMemo } from '~/entities/memo/model/types';
import { activeCategoriesQuery } from '~/features/categories/api/queries';

import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useInfiniteMemos } from './use-infinite-memos';
import { useSearchFilters } from './use-search-filters';
import { useTransformMemos } from './use-transform-memos';

interface FiltersNamespace {
  // state
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategoryId: string | undefined;
  setSelectedCategoryId: (id: string | undefined) => void;
  selectedYear: number | undefined;
  setSelectedYear: (year: number | undefined) => void;
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
    selectedYear,
    setSelectedYear,
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
      selectedYear,
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
      selectedYear,
      setSelectedYear,
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
