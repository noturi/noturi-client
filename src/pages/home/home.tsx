import { ScrollView, YStack } from 'tamagui';
import type { UICategory } from '~/entities/category';
import type { UIMemo } from '~/entities/memo';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/lib';
import { infiniteMemoListQuery } from '~/features/memo-crud/api';
import { MemoService } from '~/features/memo-crud/lib';
import Logger from '~/shared/lib/logger';
import { ApiErrorBoundary, Card, Loading, Typography } from '~/shared/ui';
import {
  CategoryFilterBar,
  MemoRatingGroupView,
  MemoSimpleView,
  MemoViewToggle,
  type MemoViewType,
} from '~/widgets/memo-list/ui';

import { useCallback, useMemo, useState } from 'react';

import { router } from 'expo-router';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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

  const memoQueryParams = {
    limit: 20,
    // 간단메모일 때는 카테고리 필터링 안함
    categoryId: selectedView === 'rating' ? selectedCategoryId : undefined,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  };

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
    const allMemos = memosData.pages.flatMap((page) => page.data);
    return MemoService.transformToUIMemos(allMemos);
  }, [memosData]);

  const handleCategoryPress = (categoryName: string) => {
    Logger.info('HomeScreen', `카테고리 선택: ${categoryName}`);
    setSelectedCategory(categoryName);
  };

  const handleMemoPress = useCallback((memo: UIMemo) => {
    Logger.info('HomeScreen', `메모 선택: ${memo.title} (${memo.id})`);
    router.push(`/memo/${memo.id}`);
  }, []);

  const handleViewChange = useCallback((view: MemoViewType) => {
    Logger.info('HomeScreen', `보기 방식 변경: ${view}`);
    setSelectedView(view);

    // 간단메모로 변경시 카테고리를 전체로 초기화
    if (view === 'simple') {
      setSelectedCategory('전체');
    }
  }, []);

  if (categoriesError) {
    const isNetworkError =
      categoriesError.message?.includes('Network request failed') ||
      categoriesError.message?.includes('카테고리 목록을 불러오는데 실패했습니다');

    return (
      <YStack
        alignItems="center"
        backgroundColor="$backgroundPrimary"
        flex={1}
        gap="$sm"
        justifyContent="center"
        padding="$sm"
      >
        <Typography color="$textPrimary" fontSize="$xl" fontWeight="$semibold" textAlign="center">
          {isNetworkError ? '서버 연결 실패' : '오류가 발생했습니다'}
        </Typography>

        <Typography color="$textMuted" fontSize="$md" maxWidth={300} textAlign="center">
          {isNetworkError
            ? '서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
            : '예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'}
        </Typography>
      </YStack>
    );
  }

  if (categoriesLoading) return <Loading text="카테고리 로딩 중..." />;

  return (
    <ApiErrorBoundary>
      <ScrollView backgroundColor="$backgroundSecondary" flex={1}>
        <YStack gap="$2xl" paddingHorizontal="$lg">
          <Card>
            <MemoViewToggle selectedView={selectedView} onViewChange={handleViewChange} />
          </Card>

          {selectedView === 'rating' && (
            <Card>
              <CategoryFilterBar categories={categories} onPress={handleCategoryPress} />
            </Card>
          )}

          {selectedView === 'rating' ? (
            <MemoRatingGroupView
              isError={Boolean(memosError)}
              isPending={memosPending}
              memos={transformedMemos}
              onMemoPress={handleMemoPress}
            />
          ) : (
            <MemoSimpleView
              isError={Boolean(memosError)}
              isPending={memosPending}
              memos={transformedMemos}
              onMemoPress={handleMemoPress}
            />
          )}
        </YStack>
      </ScrollView>
    </ApiErrorBoundary>
  );
}
