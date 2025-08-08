import { YStack } from 'tamagui';

import { CategoryChips } from './CategoryChips';
import { RatingChips } from './RatingChips';

interface CategoryLite {
  id: string;
  name: string;
}

interface FilterOptionsProps {
  show: boolean;
  categories: CategoryLite[];
  selectedCategoryIds: string[];
  toggleCategoryId: (id: string) => void;
  selectedRating: number | undefined;
  setSelectedRating: (rating: number | undefined) => void;
}

export function FilterOptions({
  show,
  categories,
  selectedCategoryIds,
  toggleCategoryId,
  selectedRating,
  setSelectedRating,
}: FilterOptionsProps) {
  if (!show) return null;

  return (
    <YStack gap="$4">
      <CategoryChips
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onToggle={toggleCategoryId}
      />
      <RatingChips selectedRating={selectedRating} onSelect={setSelectedRating} />
    </YStack>
  );
}
