import { ApiErrorBoundary, Loading, Typography } from "@/components/ui";
import { INITIAL_SORT_OPTIONS } from "@/constants";
import { activeCategoriesQuery } from "@/services/category";
import {
  CategoryService,
  type UICategory,
} from "@/services/category/categoryService";
import { infiniteMemoListQuery } from "@/services/memo";
import { MemoService, type UIMemo } from "@/services/memo/memoService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView, Separator, XStack, YStack } from "tamagui";
import { CategoryButton, SortButton } from "@/components/category";
import { MemoItem } from "@/components/memo";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOptions, setSortOptions] = useState(INITIAL_SORT_OPTIONS);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(activeCategoriesQuery());

  const sortType = CategoryService.getSortTypeFromOptions(sortOptions);
  const selectedCategoryId = CategoryService.getCategoryIdByName(
    selectedCategory,
    categoriesData?.categories
  );

  const memoQueryParams = {
    limit: 20,
    categoryId: selectedCategoryId,
    sortBy: sortType,
    sortOrder: "desc" as const,
  };

  const {
    data: memosData,
    isLoading: memosLoading,
    error: memosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(infiniteMemoListQuery(memoQueryParams));

  const categories: UICategory[] = useMemo(
    () =>
      CategoryService.transformToUICategories(
        categoriesData?.categories,
        selectedCategory
      ),
    [categoriesData?.categories, selectedCategory]
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
      }))
    );
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderMemoItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <YStack key={item.id}>
        <MemoItem memo={item} />
        {index < transformedMemos.length - 1 && (
          <Separator borderColor="$border" />
        )}
      </YStack>
    ),
    [transformedMemos.length]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack alignItems="center" paddingVertical="$4">
        <Loading />
      </YStack>
    );
  }, [isFetchingNextPage]);

  // 에러 상태 처리
  if (categoriesError) {
    const isNetworkError =
      categoriesError.message?.includes("Network request failed") ||
      categoriesError.message?.includes(
        "카테고리 목록을 불러오는데 실패했습니다"
      );

    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$4"
        backgroundColor="$backgroundPrimary"
        gap="$4"
      >
        <Typography
          fontSize="$6"
          fontWeight="600"
          color="$textPrimary"
          textAlign="center"
        >
          {isNetworkError ? "서버 연결 실패" : "오류가 발생했습니다"}
        </Typography>

        <Typography
          fontSize="$4"
          color="$textMuted"
          textAlign="center"
          maxWidth={300}
        >
          {isNetworkError
            ? "서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요."
            : "예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
        </Typography>
      </YStack>
    );
  }

  // 로딩 상태 처리
  if (categoriesLoading) {
    return <Loading text="카테고리 로딩 중..." />;
  }

  return (
    <ApiErrorBoundary>
      <YStack flex={1} backgroundColor="$backgroundPrimary">
        {/* Category Filter */}
        <YStack height={65} justifyContent="center">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal="$4" paddingVertical="$1.5" gap="$1.5">
              {categories.map((category) => (
                <CategoryButton
                  key={category.name}
                  category={category}
                  onPress={() => handleCategoryPress(category.name)}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Sort Options */}
        <YStack height={45} justifyContent="center">
          <XStack paddingHorizontal="$4" position="relative">
            {sortOptions.map((option) => (
              <SortButton
                key={option.name}
                option={option}
                onPress={() => handleSortPress(option.name)}
              />
            ))}
          </XStack>
        </YStack>

        <Separator borderColor="$border" />

        {/* Memo List */}
        {memosLoading ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Loading text="메모 로딩 중..." />
          </YStack>
        ) : memosError ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Typography color="$textMuted">
              메모를 불러오는데 실패했습니다
            </Typography>
          </YStack>
        ) : transformedMemos.length > 0 ? (
          <FlatList
            data={transformedMemos}
            renderItem={renderMemoItem}
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        ) : (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Typography color="$textMuted">작성된 메모가 없습니다</Typography>
          </YStack>
        )}
      </YStack>
    </ApiErrorBoundary>
  );
}
