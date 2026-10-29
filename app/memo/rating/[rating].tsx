import { RatingMemosPage } from '~/pages/rating-memos';

import { useLocalSearchParams } from 'expo-router';

export default function RatingMemosScreen() {
  const { rating, categoryId, year } = useLocalSearchParams<{
    rating: string;
    categoryId?: string;
    year?: string;
  }>();

  return (
    <RatingMemosPage
      categoryId={categoryId}
      rating={Number(rating)}
      year={year ? Number(year) : undefined}
    />
  );
}
