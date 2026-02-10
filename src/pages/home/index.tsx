// import { CalendarDateProvider } from '~/entities/calendar';
// import { type MemoViewType } from '~/entities/memo';
import { infiniteMemoListQuery } from '~/entities/memo';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/model';
import { MemoService } from '~/features/memo/model';
import { HREFS } from '~/shared/config/routes';
import { FloatingButton, MemoSkeleton } from '~/shared/ui';
// import { CalendarView, type CalendarViewRef } from '~/widgets';
import { MemoRatingList, YearSelectSheet } from '~/widgets';

import { Suspense, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

const LIMIT = 1000;
const SORT_BY = 'createdAt';
const SORT_ORDER = 'desc';

// 데이터 fetching 컴포넌트 (Suspense 내부)
interface HomeContentProps {
  category: string;
  year?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

function HomeContent({ category, year, onCategoryChange, onPressYear }: HomeContentProps) {
  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());
  const { data: memosData } = useSuspenseInfiniteQuery(
    infiniteMemoListQuery({
      limit: LIMIT,
      year,
      sortBy: SORT_BY,
      sortOrder: SORT_ORDER,
    }),
  );

  const allMemos = useMemo(() => {
    if (!memosData?.pages) return [];
    return memosData.pages.flatMap((page) => page?.data || []);
  }, [memosData]);

  const categories = useMemo(
    () =>
      CategoryService.transformToUICategoriesWithMemoCount(
        categoriesData?.categories,
        allMemos,
        category,
      ),
    [categoriesData?.categories, allMemos, category],
  );

  const memos = useMemo(() => {
    const categoryId = CategoryService.getCategoryIdByName(category, categoriesData?.categories);
    const filteredMemos = categoryId
      ? allMemos.filter(
          (memo) => memo.category?.id === categoryId || memo.categoryId === categoryId,
        )
      : allMemos;
    return MemoService.transformToUIMemos(filteredMemos);
  }, [allMemos, category, categoriesData?.categories]);

  return (
    <MemoRatingList
      categories={categories}
      memos={memos}
      selectedYear={year}
      onCategoryChange={onCategoryChange}
      onPressYear={onPressYear}
    />
  );
}

export function HomePage() {
  // const [view, setView] = useState<MemoViewType>('rating');
  const [year, setYear] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('전체');
  const [showYearSheet, setShowYearSheet] = useState(false);
  const insets = useSafeAreaInsets();
  // const calendarRef = useRef<CalendarViewRef>(null);

  // const handleCreate = () => {
  //   if (view === 'rating') {
  //     router.push(HREFS.memoCreate());
  //   } else {
  //     calendarRef.current?.handleFloatingButtonPress();
  //   }
  // };

  return (
    <View className="relative flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      {/* <Card>
        <MemoViewToggle selectedView={view} onViewChange={setView} />
      </Card> */}

      <View className="flex-1">
        <Suspense fallback={<MemoSkeleton />}>
          <HomeContent
            category={category}
            year={year}
            onCategoryChange={setCategory}
            onPressYear={() => setShowYearSheet(true)}
          />
        </Suspense>
        {/* <CalendarDateProvider>
          <CalendarView ref={calendarRef} />
        </CalendarDateProvider> */}
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
