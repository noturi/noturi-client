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
import { Card, FloatingButton } from '~/shared/ui';
import { CalendarView, type CalendarViewRef, MemoListHeader } from '~/widgets';

import { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

const LIMIT = 1000;
const SORT_BY = 'createdAt';
const SORT_ORDER = 'desc';

export function HomePage() {
  const [view, setView] = useState<MemoViewType>('rating');
  const [year, setYear] = useState<number>();
  const [category, setCategory] = useState('전체');
  const calendarRef = useRef<CalendarViewRef>(null);

  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());
  const { data: memosData } = useSuspenseInfiniteQuery(
    infiniteMemoListQuery({
      limit: LIMIT,
      categoryId: CategoryService.getCategoryIdByName(category, categoriesData?.categories),
      year,
      sortBy: SORT_BY,
      sortOrder: SORT_ORDER,
    }),
  );

  const categories = useMemo(
    () => CategoryService.transformToUICategories(categoriesData?.categories, category),
    [categoriesData?.categories, category],
  );

  const memos = useMemo(() => {
    if (!memosData?.pages) return [];
    return MemoService.transformToUIMemos(memosData.pages.flatMap((page) => page?.data || []));
  }, [memosData]);

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
          <ScrollView
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View className="gap-6">
              <CategoryFilterBar categories={categories} onPress={setCategory} />
              <MemoRatingGroupView
                header={<MemoListHeader selectedYear={year} onYearChange={setYear} />}
                memos={memos}
                onMemoPress={(memo) => router.push(`/memo/${memo.id}`)}
              />
            </View>
          </ScrollView>
        ) : (
          <CalendarDateProvider>
            <CalendarView ref={calendarRef} />
          </CalendarDateProvider>
        )}
      </View>

      <FloatingButton className="absolute bottom-[140px] right-4" onPress={handleCreate} />
    </View>
  );
}
