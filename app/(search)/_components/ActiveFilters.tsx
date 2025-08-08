import { XStack } from 'tamagui';

import { ActiveFilterChip } from './ActiveFilterChip';

interface CategoryLite {
  id: string;
  name: string;
}

interface ActiveFiltersProps {
  selectedCategoryIds: string[];
  selectedRating: number | undefined;
  categories: CategoryLite[];
  onClearCategory: (id: string) => void;
  onClearRating: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedCategoryIds,
  selectedRating,
  categories,
  onClearCategory,
  onClearRating,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters = selectedCategoryIds.length > 0 || selectedRating !== undefined;
  if (!hasActiveFilters) return null;

  return (
    <XStack alignItems="center" flexWrap="wrap" gap="$2">
      {selectedCategoryIds.map((id) => (
        <ActiveFilterChip
          key={id}
          label={categories.find((c) => c.id === id)?.name ?? ''}
          onClear={() => onClearCategory(id)}
        />
      ))}

      {selectedRating !== undefined && (
        <ActiveFilterChip label={`★ ${selectedRating}`} onClear={onClearRating} />
      )}

      {/* <Button borderRadius="$3" color="$textSecondary" size="$2" onPress={onClearAll}>
        모두 지우기
      </Button> */}
    </XStack>
  );
}
