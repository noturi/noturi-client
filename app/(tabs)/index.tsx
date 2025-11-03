import { YStack } from 'tamagui';
import type { UICategory } from '~/entities/category';
import type { UIMemo } from '~/entities/memo';
import { infiniteMemoListQuery } from '~/entities/memo';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/model';
import { MemoService } from '~/features/memo/model';
import { CalendarDateProvider } from '~/shared/lib/calendar/calendar-date-context';
import { Card, FloatingButton, Loading, Typography } from '~/shared/ui';
import { CalendarView, type CalendarViewRef } from '~/widgets/calendar-view';
import { MemoViewToggle, type MemoViewType, RatingView } from '~/widgets/memo-list/ui';

import { useCallback, useMemo, useRef, useState } from 'react';

import { router } from 'expo-router';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { HREFS } from '@/shared/config/routes';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedView, setSelectedView] = useState<MemoViewType>('rating');

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(activeCategoriesQuery());

  const selectedCategoryId = CategoryService.getCategoryIdByName(
    selectedCategory,
    categoriesData?.categories,
  );

  const memoQueryParams = useMemo(
    () => ({
      limit: 20,
      categoryId: selectedView === 'rating' ? selectedCategoryId : undefined,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }),
    [selectedView, selectedCategoryId],
  );

  const {
    data: memosData,
    isPending: memosPending,
    error: memosError,
  } = useInfiniteQuery(infiniteMemoListQuery(memoQueryParams));

  const categories: UICategory[] = useMemo(
    () => CategoryService.transformToUICategories(categoriesData?.categories, selectedCategory),
    [categoriesData?.categories, selectedCategory],
  );

  const transformedMemos: UIMemo[] = useMemo(() => {
    if (!memosData?.pages) return [];
    const allMemos = memosData.pages.flatMap((page) => page?.data || []);
    return MemoService.transformToUIMemos(allMemos);
  }, [memosData]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleMemoPress = useCallback((memo: UIMemo) => {
    router.push(`/memo/${memo.id}`);
  }, []);

  const handleViewChange = useCallback((view: MemoViewType) => {
    setSelectedView(view);
  }, []);

  const calendarRef = useRef<CalendarViewRef>(null);

  const handleCreateMemoPress = useCallback(() => {
    if (selectedView === 'rating') {
      router.push(HREFS.memoCreate());
    } else {
      calendarRef.current?.handleFloatingButtonPress();
    }
  }, [selectedView]);

  if (categoriesError) {
    const isNetworkError =
      categoriesError.message?.includes('Network request failed') ||
      categoriesError.message?.includes('카테고리 목록을 불러오는데 실패했습니다');

    return (
      <YStack
        alignItems="center"
        backgroundColor="$backgroundPrimary"
        flex={1}
        gap="$3"
        justifyContent="center"
        padding="$3"
      >
        <Typography color="$textPrimary" fontSize="$5" fontWeight="$5" textAlign="center">
          {isNetworkError ? '서버 연결 실패' : '오류가 발생했습니다'}
        </Typography>

        <Typography color="$textMuted" fontSize="$3" maxWidth={300} textAlign="center">
          {isNetworkError
            ? '서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
            : '예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'}
        </Typography>
      </YStack>
    );
  }

  if (categoriesLoading) return <Loading text="카테고리 로딩 중..." />;

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

      <YStack flex={1} position="relative">
        {selectedView === 'rating' && (
          <RatingView
            categories={categories}
            isError={Boolean(memosError)}
            isPending={memosPending}
            memos={transformedMemos}
            onCategoryPress={handleCategoryPress}
            onMemoPress={handleMemoPress}
          />
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
