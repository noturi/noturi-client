import { YStack } from 'tamagui';

import { CategoryChips } from './category-chips';
import { RatingChips } from './rating-chips';
import { YearChips } from './year-chips';

interface CategoryLite {
  id: string;
  name: string;
}

interface FilterOptionsProps {
  show: boolean;
  categories: CategoryLite[];
  selectedCategoryId: string | undefined;
  setSelectedCategoryId: (id: string | undefined) => void;
  selectedYear: number | undefined;
  setSelectedYear: (year: number | undefined) => void;
  selectedRating: number | undefined;
  setSelectedRating: (rating: number | undefined) => void;
}

export function FilterOptions({
  show,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedYear,
  setSelectedYear,
  selectedRating,
  setSelectedRating,
}: FilterOptionsProps) {
  if (!show) return null;

  return (
    <YStack gap="$4">
      <CategoryChips
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />
      <YearChips selectedYear={selectedYear} onSelect={setSelectedYear} />
      <RatingChips selectedRating={selectedRating} onSelect={setSelectedRating} />
    </YStack>
  );
}
