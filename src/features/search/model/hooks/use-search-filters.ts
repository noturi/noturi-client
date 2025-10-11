import { useDebounce } from '~/shared/model/use-debounce';

import { useCallback, useState } from 'react';

export interface UseSearchFiltersReturn {
  // state
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategoryIds: string[];
  toggleCategoryId: (id: string) => void;
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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);
  const clearAll = useCallback(() => {
    setSearchText('');
    setSelectedCategoryIds([]);
    setSelectedRating(undefined);
  }, []);

  const toggleCategoryId = useCallback((id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const debouncedSearchText = useDebounce(searchText, 500);
  const hasActiveFilters = selectedCategoryIds.length > 0 || selectedRating !== undefined;
  const hasSearchQuery = debouncedSearchText.length > 0 || hasActiveFilters;

  return {
    searchText,
    setSearchText,
    selectedCategoryIds,
    toggleCategoryId,
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
