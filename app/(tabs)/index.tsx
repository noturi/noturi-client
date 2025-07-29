import { Loading, Typography } from "@/components/ui";
import { INITIAL_SORT_OPTIONS } from "@/constants";
import { activeCategoriesQuery } from "@/services/category";
import {
  CategoryService,
  type UICategory,
} from "@/services/category/categoryService";
import { memoListQuery } from "@/services/memo";
import { MemoService, type UIMemo } from "@/services/memo/memoService";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { ScrollView, Separator, XStack, YStack } from "tamagui";
import { CategoryButton, MemoItem, SortButton } from "./_components";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOptions, setSortOptions] = useState(INITIAL_SORT_OPTIONS);

  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());

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

  const { data: memosData } = useSuspenseQuery(memoListQuery(memoQueryParams));

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

  return (
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
      <Suspense fallback={<Loading text="메모 로딩 중..." />}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingBottom="$6">
            {transformedMemos.length > 0 ? (
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
      </Suspense>
    </YStack>
  );
}
