import { YStack } from "tamagui";
import { CategoryChips } from "./CategoryChips";
import { RatingChips } from "./RatingChips";

interface CategoryLite {
  id: string;
  name: string;
}

interface FilterOptionsProps {
  show: boolean;
  categories: CategoryLite[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedRating: number | undefined;
  setSelectedRating: (rating: number | undefined) => void;
}

export function FilterOptions({
  show,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedRating,
  setSelectedRating,
}: FilterOptionsProps) {
  if (!show) return null;

  return (
    <YStack gap="$3" paddingTop="$3">
      <CategoryChips
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      <RatingChips
        selectedRating={selectedRating}
        onSelect={setSelectedRating}
      />
    </YStack>
  );
}
