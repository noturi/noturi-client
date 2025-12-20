import { useDebounce } from '~/shared/lib/use-debounce';

import { useCallback, useState } from 'react';

export interface UseSearchFiltersReturn {
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

export function useSearchFilters(): UseSearchFiltersReturn {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);
  const clearAll = useCallback(() => {
    setSearchText('');
    setSelectedCategoryId(undefined);
    setSelectedYear(undefined);
    setSelectedRating(undefined);
  }, []);

  const debouncedSearchText = useDebounce(searchText, 500);
  const hasActiveFilters =
    selectedCategoryId !== undefined || selectedYear !== undefined || selectedRating !== undefined;
  const hasSearchQuery = debouncedSearchText.length > 0 || hasActiveFilters;

  return {
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
  };
}
