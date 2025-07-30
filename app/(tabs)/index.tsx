import { ApiErrorBoundary, Loading, Typography } from "@/components/ui";
import { INITIAL_SORT_OPTIONS } from "@/constants";
import { activeCategoriesQuery } from "@/services/category";
import {
  CategoryService,
  type UICategory,
} from "@/services/category/categoryService";
import { memoListQuery } from "@/services/memo";
import { MemoService, type UIMemo } from "@/services/memo/memoService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ScrollView, Separator, XStack, YStack } from "tamagui";
import { CategoryButton, MemoItem, SortButton } from "./_components";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOptions, setSortOptions] = useState(INITIAL_SORT_OPTIONS);

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useQuery(activeCategoriesQuery());

  const sortType = CategoryService.getSortTypeFromOptions(sortOptions);
  const selectedCategoryId = CategoryService.getCategoryIdByName(
    selectedCategory,
    categoriesData?.categories
  );

  const memoQueryParams = {
    page: 1,
    limit: 20,
    categoryId: selectedCategoryId,
    sortBy: sortType,
    sortOrder: "desc" as const,
  };

  const { 
    data: memosData, 
    isLoading: memosLoading, 
    error: memosError 
  } = useQuery(memoListQuery(memoQueryParams));

  const categories: UICategory[] = useMemo(
    () =>
      CategoryService.transformToUICategories(
        categoriesData?.categories,
        selectedCategory
      ),
    [categoriesData?.categories, selectedCategory]
  );

  const transformedMemos: UIMemo[] = useMemo(() => {
    const transformed = MemoService.transformToUIMemos(memosData?.data);
    return transformed;
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

  // 에러 상태 처리
  if (categoriesError) {
    const isNetworkError = categoriesError.message?.includes("Network request failed") ||
                          categoriesError.message?.includes("카테고리 목록을 불러오는데 실패했습니다");
    
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
            : "예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요."
          }
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          maxHeight={48}
        >
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

        {/* Sort Options */}
        <XStack paddingHorizontal="$4" paddingTop="$1.5" position="relative">
          {sortOptions.map((option) => (
            <SortButton
              key={option.name}
              option={option}
              onPress={() => handleSortPress(option.name)}
            />
          ))}
        </XStack>

        <Separator borderColor="$border" />

        {/* Memo List */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingBottom="$6">
            {memosLoading ? (
              <YStack alignItems="center" paddingVertical="$6">
                <Loading text="메모 로딩 중..." />
              </YStack>
            ) : memosError ? (
              <YStack alignItems="center" paddingVertical="$6">
                <Typography color="$textMuted">
                  메모를 불러오는데 실패했습니다
                </Typography>
              </YStack>
            ) : transformedMemos.length > 0 ? (
              transformedMemos.map((memo, index) => (
                <YStack key={memo.id}>
                  <MemoItem memo={memo} />
                  {index < transformedMemos.length - 1 && (
                    <Separator borderColor="$border" />
                  )}
                </YStack>
              ))
            ) : (
              <YStack alignItems="center" paddingVertical="$6">
                <Typography color="$textMuted">
                  작성된 메모가 없습니다
                </Typography>
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </ApiErrorBoundary>
  );
}
