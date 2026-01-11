import { View } from 'react-native';

import { ActiveFilterChip } from './active-filter-chip';

interface CategoryLite {
  id: string;
  name: string;
}

interface ActiveFiltersProps {
  selectedCategoryId: string | undefined;
  selectedYear: number | undefined;
  selectedRating: number | undefined;
  categories: CategoryLite[];
  onClearCategory: () => void;
  onClearYear: () => void;
  onClearRating: () => void;
}

export function ActiveFilters({
  selectedCategoryId,
  selectedYear,
  selectedRating,
  categories,
  onClearCategory,
  onClearYear,
  onClearRating,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    selectedCategoryId !== undefined || selectedYear !== undefined || selectedRating !== undefined;
  if (!hasActiveFilters) return null;

  const categoryName = categories.find((c) => c.id === selectedCategoryId)?.name;

  return (
    <View className="flex-row flex-wrap items-center gap-1">
      {categoryName && <ActiveFilterChip label={categoryName} onClear={onClearCategory} />}

      {selectedYear !== undefined && (
        <ActiveFilterChip label={`${selectedYear}년`} onClear={onClearYear} />
      )}

      {selectedRating !== undefined && (
        <ActiveFilterChip label={`★ ${selectedRating}`} onClear={onClearRating} />
      )}
    </View>
  );
}
