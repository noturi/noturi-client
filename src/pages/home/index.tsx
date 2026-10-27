import { activeCategoriesQuery, findCategoryIdByName, toUICategories } from '~/entities/category';
import { type MemoListParamsDto, MemoSkeleton } from '~/entities/memo';
import { HREFS } from '~/shared/config/routes';
import { FloatingButton } from '~/shared/ui';
import { MemoRatingList, YearSelectSheet } from '~/widgets';

import { Suspense, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useSuspenseQuery } from '@tanstack/react-query';

import { PAGE_LIMIT, SORT_BY, SORT_ORDER, useRatingGroups } from './model/use-rating-groups';

interface HomeContentProps {
  category: string;
  year?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

function HomeContent({ category, year, onCategoryChange, onPressYear }: HomeContentProps) {
  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());

  const categoryId = useMemo(
    () => findCategoryIdByName(category, categoriesData?.categories),
    [category, categoriesData?.categories],
  );

  const queryParams: Omit<MemoListParamsDto, 'page'> = useMemo(
    () => ({ limit: PAGE_LIMIT, year, categoryId, sortBy: SORT_BY, sortOrder: SORT_ORDER }),
    [year, categoryId],
  );

  const ratingGroups = useRatingGroups(queryParams);

  const categories = useMemo(
    () => toUICategories(categoriesData?.categories, category),
    [categoriesData?.categories, category],
  );

  return (
    <MemoRatingList
      categories={categories}
      ratingGroups={ratingGroups}
      selectedYear={year}
      onCategoryChange={onCategoryChange}
      onPressYear={onPressYear}
    />
  );
}

export function HomePage() {
  const [year, setYear] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('전체');
  const [showYearSheet, setShowYearSheet] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View className="relative flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      <View className="flex-1">
        <Suspense fallback={<MemoSkeleton />}>
          <HomeContent
            category={category}
            year={year}
            onCategoryChange={setCategory}
            onPressYear={() => setShowYearSheet(true)}
          />
        </Suspense>
      </View>

      <View className="absolute right-6" style={{ bottom: insets.bottom + 49 + 20 }}>
        <FloatingButton onPress={() => router.push(HREFS.memoCreate())} />
      </View>

      <YearSelectSheet
        isOpen={showYearSheet}
        selectedYear={year}
        onClose={() => setShowYearSheet(false)}
        onYearChange={setYear}
      />
    </View>
  );
}
