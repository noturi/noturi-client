import {
  ALL_CATEGORY_NAME,
  activeCategoriesQuery,
  findCategoryIdByName,
  toUICategories,
} from '~/entities/category';
import { MemoSkeleton } from '~/entities/memo';
import { userSettingsQuery } from '~/entities/user';
import { useConfirmDeleteMemo } from '~/features/memo';
import { HREFS } from '~/shared/config/routes';
import { FloatingButton } from '~/shared/ui';
import { MemoRatingList, YearSelectSheet } from '~/widgets';

import { Suspense, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useRatingSections } from './model/use-rating-sections';

interface HomeContentProps {
  /** 사용자가 고른 탭 — 아직 고르지 않았으면 undefined(맨 앞 탭) */
  category?: string;
  year?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

function HomeContent({ category, year, onCategoryChange, onPressYear }: HomeContentProps) {
  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());
  // 설정은 앱 시작 때(테마) 이미 받아 둔 캐시 — 추가 요청 없음
  const { data: settings } = useQuery(userSettingsQuery());

  // 아직 고른 탭이 없으면 맨 앞 탭 — "전체"를 뒤로 옮겼으면 첫 카테고리
  const firstTab =
    toUICategories(categoriesData?.categories, '', settings?.allCategoryOrder)[0]?.name ??
    ALL_CATEGORY_NAME;
  const selectedCategory = category ?? firstTab;
  const categoryId = findCategoryIdByName(selectedCategory, categoriesData?.categories);

  const { sections, isLoading, isError, refetch } = useRatingSections({ categoryId, year });
  const { confirmDelete } = useConfirmDeleteMemo();

  const categories = toUICategories(
    categoriesData?.categories,
    selectedCategory,
    settings?.allCategoryOrder,
  );

  return (
    <MemoRatingList
      categories={categories}
      isError={isError}
      isLoading={isLoading}
      sections={sections}
      selectedYear={year}
      onCategoryChange={onCategoryChange}
      onMemoDelete={(memo) => confirmDelete(memo)}
      onMemoEdit={(memo) => router.push(HREFS.memoEdit(memo.id))}
      onMemoPress={(memo) => router.push(HREFS.memoDetail(memo.id))}
      onPressMore={(rating) => router.push(HREFS.memoRating(rating, { categoryId, year }))}
      onPressYear={onPressYear}
      onRetry={() => void refetch()}
    />
  );
}

export function HomePage() {
  const [year, setYear] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
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
