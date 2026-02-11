import type { UICategory } from '~/entities/category/model/types';
import { CategoryFilterBar, MemoRatingGroupView } from '~/entities/memo';
import type { RatingGroupData } from '~/entities/memo/model/types';
import { MemoListHeader } from '~/widgets/memo-list-with-year-filter';

import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

interface MemoRatingListProps {
  ratingGroups: RatingGroupData[];
  categories: UICategory[];
  selectedYear?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

export function MemoRatingList({
  ratingGroups,
  categories,
  selectedYear,
  onCategoryChange,
  onPressYear,
}: MemoRatingListProps) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View className="gap-6">
        <CategoryFilterBar categories={categories} onPress={onCategoryChange} />
        <MemoRatingGroupView
          header={<MemoListHeader selectedYear={selectedYear} onPressYear={onPressYear} />}
          ratingGroups={ratingGroups}
          onMemoPress={(memo) => router.push(`/memo/${memo.id}`)}
        />
      </View>
    </ScrollView>
  );
}
