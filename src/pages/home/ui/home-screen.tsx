import { ScrollView, XStack, YStack } from 'tamagui';
import { CalendarDateProvider } from '~/entities/calendar';
import {
  CategoryFilterBar,
  MemoRatingGroupView,
  MemoViewToggle,
  type MemoViewType,
  type UIMemo,
} from '~/entities/memo';
import { HREFS } from '~/shared/config/routes';
import { ApiErrorBoundary, Card, FloatingButton, Skeleton } from '~/shared/ui';
import { CalendarView, type CalendarViewRef, MemoListHeader } from '~/widgets';

import { Suspense, useCallback, useRef, useState } from 'react';

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
    <YStack gap="$3">
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$3">
        <Skeleton borderRadius={4} height={24} width={50} />
        <XStack alignItems="center" gap="$2">
          <Skeleton borderRadius={4} height={16} width={16} />
          <Skeleton borderRadius={4} height={16} width={40} />
          <Skeleton borderRadius={4} height={16} width={12} />
        </XStack>
      </XStack>
      <YStack gap="$4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <YStack gap="$3" padding="$3">
              <Skeleton borderRadius={4} height={20} width={80} />
              <YStack gap="$2">
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="75%" />
                <Skeleton height={16} width="60%" />
              </YStack>
            </YStack>
          </Card>
        ))}
      </YStack>
    </YStack>
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
    <YStack
      backgroundColor="$backgroundSecondary"
      flex={1}
      gap="$4"
      paddingHorizontal="$4"
      paddingTop="$4"
      position="relative"
    >
      <Card>
        <MemoViewToggle selectedView={selectedView} onViewChange={handleViewChange} />
      </Card>

      <YStack flex={1}>
        {selectedView === 'rating' && (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 200 }}
            flex={1}
            showsVerticalScrollIndicator={false}
          >
            <YStack gap="$6">
              <CategoryFilterBar categories={categories} onPress={handleCategoryPress} />

              <ApiErrorBoundary>
                <Suspense fallback={<MemoSkeleton />}>
                  <MemoContent
                    selectedCategoryId={selectedCategoryId}
                    selectedView={selectedView}
                    selectedYear={selectedYear}
                    onMemoPress={handleMemoPress}
                    onYearChange={handleYearChange}
                  />
                </Suspense>
              </ApiErrorBoundary>
            </YStack>
          </ScrollView>
        )}

        {selectedView === 'calendar' && (
          <CalendarDateProvider>
            <CalendarView ref={calendarRef} />
          </CalendarDateProvider>
        )}
      </YStack>

      <YStack bottom={140} position="absolute" right="$4">
        <FloatingButton onPress={handleCreateMemoPress} />
      </YStack>
    </YStack>
  );
}
