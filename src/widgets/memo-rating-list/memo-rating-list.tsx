import type { UICategory } from '~/entities/category/model/types';
import { CategoryFilterBar, MemoRatingGroupView } from '~/entities/memo';
import type { UIMemo } from '~/entities/memo/model/types';
import { MemoListHeader } from '~/widgets/memo-list-with-year-filter';

import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

interface MemoRatingListProps {
  memos: UIMemo[];
  categories: UICategory[];
  selectedYear?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

export function MemoRatingList({
  memos,
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
          memos={memos}
          onMemoPress={(memo) => router.push(`/memo/${memo.id}`)}
        />
      </View>
    </ScrollView>
  );
}
