import { Separator, YStack } from 'tamagui';
import type { UICategory } from '~/entities/category';
import type { UIMemo } from '~/entities/memo';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/lib';
import { infiniteMemoListQuery } from '~/features/memo-crud/api';
import { MemoService } from '~/features/memo-crud/lib';
import { INITIAL_SORT_OPTIONS } from '~/shared/constants';
import { ApiErrorBoundary, Loading, Typography } from '~/shared/ui';
import { CategoryFilterBar, MemoListView, SortOptionsBar } from '~/widgets/memo-list/ui';

import { useCallback, useMemo, useState } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOptions, setSortOptions] = useState(INITIAL_SORT_OPTIONS);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(activeCategoriesQuery());

  const sortType = CategoryService.getSortTypeFromOptions(sortOptions);
  const selectedCategoryId = CategoryService.getCategoryIdByName(
    selectedCategory,
    categoriesData?.categories,
  );

  const memoQueryParams = {
    limit: 20,
    categoryId: selectedCategoryId,
    sortBy: sortType,
    sortOrder: 'desc' as const,
  };

  const {
    data: memosData,
    isPending: memosPending,
    error: memosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
    setSelectedCategory(categoryName);
  };

  const handleSortPress = (sortName: string) => {
    setSortOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        active: option.name === sortName,
      })),
    );
  };

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (categoriesError) {
    const isNetworkError =
      categoriesError.message?.includes('Network request failed') ||
      categoriesError.message?.includes('카테고리 목록을 불러오는데 실패했습니다');

    return (
      <YStack
        alignItems="center"
        backgroundColor="$backgroundPrimary"
        flex={1}
        gap="$4"
        justifyContent="center"
        padding="$4"
      >
        <Typography color="$textPrimary" fontSize="$6" fontWeight="600" textAlign="center">
          {isNetworkError ? '서버 연결 실패' : '오류가 발생했습니다'}
        </Typography>

        <Typography color="$textMuted" fontSize="$4" maxWidth={300} textAlign="center">
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
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <CategoryFilterBar categories={categories} onPress={handleCategoryPress} />
        <SortOptionsBar options={sortOptions} onPress={handleSortPress} />
        <Separator borderColor="$border" />
        <MemoListView
          isError={Boolean(memosError)}
          isFetchingNextPage={isFetchingNextPage}
          isPending={memosPending}
          memos={transformedMemos}
          onEndReached={handleEndReached}
        />
      </YStack>
    </ApiErrorBoundary>
  );
}
