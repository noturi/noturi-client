import { CalendarDateProvider } from '~/entities/calendar';
import {
  CategoryFilterBar,
  MemoRatingGroupView,
  MemoViewToggle,
  type MemoViewType,
  type UIMemo,
} from '~/entities/memo';
import { HREFS } from '~/shared/config/routes';
import { Card, FloatingButton, Skeleton } from '~/shared/ui';
import { CalendarView, type CalendarViewRef, MemoListHeader } from '~/widgets';

import { Suspense, useCallback, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { router } from 'expo-router';

import { useHomeCategories, useHomeMemos } from '../model';

interface MemoContentProps {
  selectedView: MemoViewType;
  selectedCategoryId: string | undefined;
  selectedYear: number | undefined;
  onYearChange: (year: number | undefined) => void;
  onMemoPress: (memo: UIMemo) => void;
}

function MemoContent({
  selectedView,
  selectedCategoryId,
  selectedYear,
  onYearChange,
  onMemoPress,
}: MemoContentProps) {
  const { memos } = useHomeMemos({ selectedView, selectedCategoryId, selectedYear });

  return (
    <MemoRatingGroupView
      header={<MemoListHeader selectedYear={selectedYear} onYearChange={onYearChange} />}
      memos={memos}
      onMemoPress={onMemoPress}
    />
  );
}

function MemoSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-3">
        <Skeleton borderRadius={4} height={24} width={50} />
        <View className="flex-row items-center gap-2">
          <Skeleton borderRadius={4} height={16} width={16} />
          <Skeleton borderRadius={4} height={16} width={40} />
          <Skeleton borderRadius={4} height={16} width={12} />
        </View>
      </View>
      <View className="gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <View className="gap-3 p-3">
              <Skeleton borderRadius={4} height={20} width={80} />
              <View className="gap-2">
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="75%" />
                <Skeleton height={16} width="60%" />
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

export function HomeScreen() {
  const [selectedView, setSelectedView] = useState<MemoViewType>('rating');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const calendarRef = useRef<CalendarViewRef>(null);

  const { categories, selectedCategoryId, handleCategoryPress } = useHomeCategories();

  const handleMemoPress = useCallback((memo: UIMemo) => {
    router.push(`/memo/${memo.id}`);
  }, []);

  const handleViewChange = useCallback((view: MemoViewType) => {
    setSelectedView(view);
  }, []);

  const handleYearChange = useCallback((year: number | undefined) => {
    setSelectedYear(year);
  }, []);

  const handleCreateMemoPress = useCallback(() => {
    if (selectedView === 'rating') {
      router.push(HREFS.memoCreate());
    } else {
      calendarRef.current?.handleFloatingButtonPress();
    }
  }, [selectedView]);

  return (
    <View className="relative flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      <Card>
        <MemoViewToggle selectedView={selectedView} onViewChange={handleViewChange} />
      </Card>

      <View className="flex-1">
        {selectedView === 'rating' && (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View className="gap-6">
              <CategoryFilterBar categories={categories} onPress={handleCategoryPress} />

              <Suspense fallback={<MemoSkeleton />}>
                <MemoContent
                  selectedCategoryId={selectedCategoryId}
                  selectedView={selectedView}
                  selectedYear={selectedYear}
                  onMemoPress={handleMemoPress}
                  onYearChange={handleYearChange}
                />
              </Suspense>
            </View>
          </ScrollView>
        )}

        {selectedView === 'calendar' && (
          <CalendarDateProvider>
            <CalendarView ref={calendarRef} />
          </CalendarDateProvider>
        )}
      </View>

      <View className="absolute bottom-[140px] right-4">
        <FloatingButton onPress={handleCreateMemoPress} />
      </View>
    </View>
  );
}
