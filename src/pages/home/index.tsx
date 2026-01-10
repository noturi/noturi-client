import { CalendarDateProvider } from '~/entities/calendar';
import {
  CategoryFilterBar,
  MemoRatingGroupView,
  MemoViewToggle,
  type MemoViewType,
  infiniteMemoListQuery,
} from '~/entities/memo';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/model';
import { MemoService } from '~/features/memo/model';
import { HREFS } from '~/shared/config/routes';
import { Card, FloatingButton, MemoSkeleton } from '~/shared/ui';
import { CalendarView, type CalendarViewRef, MemoListHeader, YearSelectSheet } from '~/widgets';

import { Suspense, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

const LIMIT = 1000;
const SORT_BY = 'createdAt';
const SORT_ORDER = 'desc';

// 메모 목록 컴포넌트 (Suspense 내부)
interface MemoListContentProps {
  category: string;
  year?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

function MemoListContent({ category, year, onCategoryChange, onPressYear }: MemoListContentProps) {
  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());
  // 년도 필터만 적용하여 전체 메모를 가져옴 (카테고리 개수 계산용)
  const { data: memosData } = useSuspenseInfiniteQuery(
    infiniteMemoListQuery({
      limit: LIMIT,
      year,
      sortBy: SORT_BY,
      sortOrder: SORT_ORDER,
    }),
  );

  // 전체 메모 목록 (년도 필터만 적용)
  const allMemos = useMemo(() => {
    if (!memosData?.pages) return [];
    return memosData.pages.flatMap((page) => page?.data || []);
  }, [memosData]);

  // 카테고리 개수는 년도 필터가 적용된 전체 메모 기준으로 계산
  const categories = useMemo(
    () =>
      CategoryService.transformToUICategoriesWithMemoCount(
        categoriesData?.categories,
        allMemos,
        category,
      ),
    [categoriesData?.categories, allMemos, category],
  );

  // UI에 표시할 메모는 카테고리 필터도 적용
  const memos = useMemo(() => {
    const categoryId = CategoryService.getCategoryIdByName(category, categoriesData?.categories);
    const filteredMemos = categoryId
      ? allMemos.filter((memo) => memo.category?.id === categoryId || memo.categoryId === categoryId)
      : allMemos;
    return MemoService.transformToUIMemos(filteredMemos);
  }, [allMemos, category, categoriesData?.categories]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View className="gap-6">
        <CategoryFilterBar categories={categories} onPress={onCategoryChange} />
        <MemoRatingGroupView
          header={<MemoListHeader selectedYear={year} onPressYear={onPressYear} />}
          memos={memos}
          onMemoPress={(memo) => router.push(`/memo/${memo.id}`)}
        />
      </View>
    </ScrollView>
  );
}

export function HomePage() {
  const [view, setView] = useState<MemoViewType>('rating');
  const [year, setYear] = useState<number | undefined>(new Date().getFullYear());
  const [category, setCategory] = useState('전체');
  const [showYearSheet, setShowYearSheet] = useState(false);
  const calendarRef = useRef<CalendarViewRef>(null);

  const handleCreate = () => {
    if (view === 'rating') {
      router.push(HREFS.memoCreate());
    } else {
      calendarRef.current?.handleFloatingButtonPress();
    }
  };

  return (
    <View className="relative flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      <Card>
        <MemoViewToggle selectedView={view} onViewChange={setView} />
      </Card>

      <View className="flex-1">
        {view === 'rating' ? (
          <Suspense fallback={<MemoSkeleton />}>
            <MemoListContent
              category={category}
              year={year}
              onCategoryChange={setCategory}
              onPressYear={() => setShowYearSheet(true)}
            />
          </Suspense>
        ) : (
          <CalendarDateProvider>
            <CalendarView ref={calendarRef} />
          </CalendarDateProvider>
        )}
      </View>

      <FloatingButton className="absolute bottom-[140px] right-4" onPress={handleCreate} />

      <YearSelectSheet
        isOpen={showYearSheet}
        selectedYear={year}
        onClose={() => setShowYearSheet(false)}
        onYearChange={setYear}
      />
    </View>
  );
}
