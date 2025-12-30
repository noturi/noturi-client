import type { UICategory } from '~/entities/category';

import { ScrollView, View } from 'react-native';

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
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View className="gap-6">
        <CategoryFilterBar categories={categories} onPress={onCategoryPress} />
        <MemoRatingGroupView memos={memos} onMemoPress={onMemoPress} />
      </View>
    </ScrollView>
  );
}
