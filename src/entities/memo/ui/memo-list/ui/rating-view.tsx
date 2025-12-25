import { ScrollView, View } from 'react-native';

import type { UICategory } from '~/entities/category';

import type { UIMemo } from '../../../model/types';
import { CategoryFilterBar } from './category-filter-bar';
import { MemoRatingGroupView } from './memo-rating-group-view';

interface RatingViewProps {
  categories: UICategory[];
  memos: UIMemo[];
  onCategoryPress: (categoryName: string) => void;
  onMemoPress: (memo: UIMemo) => void;
}

export function RatingView({ categories, memos, onCategoryPress, onMemoPress }: RatingViewProps) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <CategoryFilterBar categories={categories} onPress={onCategoryPress} />
        <MemoRatingGroupView memos={memos} onMemoPress={onMemoPress} />
      </View>
    </ScrollView>
  );
}
