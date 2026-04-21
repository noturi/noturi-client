import { infiniteMemoListQuery } from '~/entities/memo';
import type { MemoListParamsDto, RatingGroupData } from '~/entities/memo/model/types';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/model';
import { MemoService } from '~/features/memo/model';
import { HREFS } from '~/shared/config/routes';
import { FloatingButton, MemoSkeleton } from '~/shared/ui';
import { MemoRatingList, YearSelectSheet } from '~/widgets';

import { Suspense, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { keepPreviousData, useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

const UNRATED = 0 as const;
const RATINGS = [5, 4, 3, 2, 1, UNRATED] as const;
const RATING_FILTERS: Record<number, Partial<MemoListParamsDto>> = {
  5: { minRating: 5, maxRating: 5 },
  4: { minRating: 4, maxRating: 4.5 },
  3: { minRating: 3, maxRating: 3.5 },
  2: { minRating: 2, maxRating: 2.5 },
  1: { minRating: 1, maxRating: 1.5 },
  [UNRATED]: { hasRating: false },
};
const PAGE_LIMIT = 50;
const SORT_BY = 'createdAt';
const SORT_ORDER = 'desc';

function useRatingQuery(queryParams: Omit<MemoListParamsDto, 'page'>, rating: number) {
  return useInfiniteQuery({
    ...infiniteMemoListQuery({ ...queryParams, ...RATING_FILTERS[rating] }),
    placeholderData: keepPreviousData,
  });
}

function buildRatingGroup(
  rating: number,
  query: ReturnType<typeof useRatingQuery>,
): RatingGroupData {
  const allMemos = query.data?.pages.flatMap((page) => page?.data || []) || [];
  const seen = new Set<string>();
  const memos = allMemos.filter((memo) => {
    if (seen.has(memo.id)) return false;
    seen.add(memo.id);
    return true;
  });

  return {
    rating,
    memos: MemoService.transformToUIMemos(memos),
    total: query.data?.pages[0]?.total || 0,
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

function useRatingGroups(queryParams: Omit<MemoListParamsDto, 'page'>): RatingGroupData[] {
  const r5 = useRatingQuery(queryParams, 5);
  const r4 = useRatingQuery(queryParams, 4);
  const r3 = useRatingQuery(queryParams, 3);
  const r2 = useRatingQuery(queryParams, 2);
  const r1 = useRatingQuery(queryParams, 1);
  const r0 = useRatingQuery(queryParams, UNRATED);

  return useMemo(
    () => {
      const queries = [r5, r4, r3, r2, r1, r0];
      return RATINGS.map((rating, i) => buildRatingGroup(rating, queries[i]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      r5.data,
      r5.hasNextPage,
      r5.isFetchingNextPage,
      r5.isLoading,
      r4.data,
      r4.hasNextPage,
      r4.isFetchingNextPage,
      r4.isLoading,
      r3.data,
      r3.hasNextPage,
      r3.isFetchingNextPage,
      r3.isLoading,
      r2.data,
      r2.hasNextPage,
      r2.isFetchingNextPage,
      r2.isLoading,
      r1.data,
      r1.hasNextPage,
      r1.isFetchingNextPage,
      r1.isLoading,
      r0.data,
      r0.hasNextPage,
      r0.isFetchingNextPage,
      r0.isLoading,
    ],
  );
}

interface HomeContentProps {
  category: string;
  year?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

function HomeContent({ category, year, onCategoryChange, onPressYear }: HomeContentProps) {
  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());

  const categoryId = useMemo(
    () => CategoryService.getCategoryIdByName(category, categoriesData?.categories),
    [category, categoriesData?.categories],
  );

  const queryParams: Omit<MemoListParamsDto, 'page'> = useMemo(
    () => ({ limit: PAGE_LIMIT, year, categoryId, sortBy: SORT_BY, sortOrder: SORT_ORDER }),
    [year, categoryId],
  );

  const ratingGroups = useRatingGroups(queryParams);

  const categories = useMemo(
    () => CategoryService.transformToUICategories(categoriesData?.categories, category),
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
