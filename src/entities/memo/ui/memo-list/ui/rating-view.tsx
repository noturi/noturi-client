import type { UICategory } from '~/entities/category';
import type { RatingGroupData, UIMemo } from '~/entities/memo/model/types';

import { ScrollView, View } from 'react-native';

import { CategoryFilterBar } from './category-filter-bar';
import { MemoRatingGroupView } from './memo-rating-group-view';

interface RatingViewProps {
  categories: UICategory[];
  ratingGroups: RatingGroupData[];
  onCategoryPress: (categoryName: string) => void;
  onMemoPress: (memo: UIMemo) => void;
}

export function RatingView({
  categories,
  ratingGroups,
  onCategoryPress,
  onMemoPress,
}: RatingViewProps) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View className="gap-6">
        <CategoryFilterBar categories={categories} onPress={onCategoryPress} />
        <MemoRatingGroupView ratingGroups={ratingGroups} onMemoPress={onMemoPress} />
      </View>
    </ScrollView>
  );
}
