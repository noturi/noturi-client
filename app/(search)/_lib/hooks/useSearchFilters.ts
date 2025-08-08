import { useCallback, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';

export interface UseSearchFiltersReturn {
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

export function useSearchFilters(): UseSearchFiltersReturn {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);
  const clearAll = useCallback(() => {
    setSearchText('');
    setSelectedCategoryId('');
    setSelectedRating(undefined);
  }, []);

  const debouncedSearchText = useDebounce(searchText, 500);
  const hasActiveFilters = selectedCategoryId !== '' || selectedRating !== undefined;
  const hasSearchQuery = debouncedSearchText.length > 0 || hasActiveFilters;

  return {
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
  };
}
