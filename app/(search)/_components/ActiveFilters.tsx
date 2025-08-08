import { Button, XStack } from "tamagui";
import { ActiveFilterChip } from "./ActiveFilterChip";

interface CategoryLite {
  id: string;
  name: string;
}

interface ActiveFiltersProps {
  selectedCategoryId: string;
  selectedRating: number | undefined;
  categories: CategoryLite[];
  onClearCategory: () => void;
  onClearRating: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedCategoryId,
  selectedRating,
  categories,
  onClearCategory,
  onClearRating,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    selectedCategoryId !== "" || selectedRating !== undefined;
  if (!hasActiveFilters) return null;

  return (
    <XStack gap="$2" alignItems="center" flexWrap="wrap">
      {selectedCategoryId && (
        <ActiveFilterChip
          label={
            categories.find((c) => c.id === selectedCategoryId)?.name ?? ""
          }
          onClear={onClearCategory}
        />
      )}

      {selectedRating !== undefined && (
        <ActiveFilterChip
          label={`★ ${selectedRating}+`}
          onClear={onClearRating}
        />
      )}

      <Button
        size="$2"
        backgroundColor="$surface"
        color="$textSecondary"
        borderRadius="$3"
        onPress={onClearAll}
      >
        모두 지우기
      </Button>
    </XStack>
  );
}
