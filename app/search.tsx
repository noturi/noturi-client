import { MemoItem } from "@/components/memo/MemoItem";
import { Typography, Loading } from "@/components/ui";
import { MemoService, memoApi, type MemoListResponseDto } from "@/services/memo";
import { activeCategoriesQuery } from "@/services/category";
import { useDebounce } from "@/hooks";
import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import {
  Button,
  ScrollView,
  TextArea,
  XStack,
  YStack,
  Separator,
} from "tamagui";
import { Search, X, Filter } from "@tamagui/lucide-icons";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // 검색어 디바운싱 (500ms)
  const debouncedSearchText = useDebounce(searchText, 500);

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  // 검색 쿼리 (실제 검색어가 있을 때만 실행)
  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<MemoListResponseDto, Error, InfiniteData<MemoListResponseDto>, string[], number>({
    queryKey: ["memos", "search", debouncedSearchText, selectedCategoryId, selectedRating?.toString() ?? ""],
    queryFn: ({ pageParam }) =>
      memoApi.getMemos({
        page: pageParam,
        limit: 20,
        search: debouncedSearchText || undefined,
        categoryId: selectedCategoryId || undefined,
        rating: selectedRating,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    enabled: debouncedSearchText.length > 0 || selectedCategoryId !== "" || selectedRating !== undefined,
  });

  // 검색 결과를 UI 형태로 변환
  const transformedMemos = useMemo(() => {
    if (!searchResults?.pages) return [];
    const allMemos = searchResults.pages.flatMap((page) => page.data);
    return MemoService.transformToUIMemos(allMemos);
  }, [searchResults]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = useCallback(() => {
    if (debouncedSearchText.trim() || selectedCategoryId || selectedRating !== undefined) {
      refetch();
    }
  }, [debouncedSearchText, selectedCategoryId, selectedRating, refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchText("");
    setSelectedCategoryId("");
    setSelectedRating(undefined);
  }, []);

  const renderMemoItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
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
      <Loading size="small" text="" flex={false} />
    );
  }, [isFetchingNextPage]);

  const hasActiveFilters = selectedCategoryId !== "" || selectedRating !== undefined;
  const hasSearchQuery = debouncedSearchText.length > 0 || hasActiveFilters;

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      {/* 검색 입력 */}
      <YStack padding="$4" gap="$3" borderBottomWidth={1} borderBottomColor="$border">
        <XStack gap="$3" alignItems="center">
          <YStack flex={1}>
            <TextArea
              placeholder="제목과 내용에서 검색..."
              value={searchText}
              onChangeText={setSearchText}
              backgroundColor="$backgroundSecondary"
              borderWidth={0}
              borderRadius="$6"
              fontSize="$4"
              color="$textPrimary"
              placeholderTextColor="$textMuted"
              padding="$3"
              maxHeight={48}
              multiline={false}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </YStack>
          <Button
            size="$4"
            backgroundColor="$primary"
            color="$textOnPrimary"
            borderRadius="$6"
            onPress={handleSearch}
            disabled={!debouncedSearchText.trim() && !hasActiveFilters}
          >
            <Search size={16} />
          </Button>
          <Button
            size="$4"
            backgroundColor={hasActiveFilters ? "$primary" : "$surface"}
            color={hasActiveFilters ? "$textOnPrimary" : "$textSecondary"}
            borderRadius="$6"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
          </Button>
        </XStack>

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            {selectedCategoryId && (
              <XStack
                backgroundColor="$primary"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
                alignItems="center"
                gap="$1"
              >
                <Typography variant="caption" color="$textOnPrimary">
                  {categories.find(c => c.id === selectedCategoryId)?.name}
                </Typography>
                <Button
                  size="$1"
                  backgroundColor="$backgroundTransparent"
                  color="$textOnPrimary"
                  onPress={() => setSelectedCategoryId("")}
                >
                  <X size={12} />
                </Button>
              </XStack>
            )}
            {selectedRating !== undefined && (
              <XStack
                backgroundColor="$primary"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$3"
                alignItems="center"
                gap="$1"
              >
                <Typography variant="caption" color="$textOnPrimary">
                  ★ {selectedRating}+
                </Typography>
                <Button
                  size="$1"
                  backgroundColor="$backgroundTransparent"
                  color="$textOnPrimary"
                  onPress={() => setSelectedRating(undefined)}
                >
                  <X size={12} />
                </Button>
              </XStack>
            )}
            <Button
              size="$2"
              backgroundColor="$surface"
              color="$textSecondary"
              borderRadius="$3"
              onPress={handleClearSearch}
            >
              모두 지우기
            </Button>
          </XStack>
        )}

        {/* 필터 옵션 */}
        {showFilters && (
          <YStack gap="$3" paddingTop="$3">
            {/* 카테고리 필터 */}
            <YStack gap="$2">
              <Typography variant="title" fontSize="$3">카테고리</Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2">
                  <Button
                    backgroundColor={selectedCategoryId === "" ? "$primary" : "$surface"}
                    color={selectedCategoryId === "" ? "$textOnPrimary" : "$textSecondary"}
                    borderRadius="$5"
                    size="$3"
                    onPress={() => setSelectedCategoryId("")}
                  >
                    전체
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      backgroundColor={selectedCategoryId === category.id ? "$primary" : "$surface"}
                      color={selectedCategoryId === category.id ? "$textOnPrimary" : "$textSecondary"}
                      borderRadius="$5"
                      size="$3"
                      onPress={() => setSelectedCategoryId(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>

            {/* 평점 필터 */}
            <YStack gap="$2">
              <Typography variant="title" fontSize="$3">평점</Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2">
                  <Button
                    backgroundColor={selectedRating === undefined ? "$primary" : "$surface"}
                    color={selectedRating === undefined ? "$textOnPrimary" : "$textSecondary"}
                    borderRadius="$5"
                    size="$3"
                    onPress={() => setSelectedRating(undefined)}
                  >
                    전체
                  </Button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      backgroundColor={selectedRating === rating ? "$primary" : "$surface"}
                      color={selectedRating === rating ? "$textOnPrimary" : "$textSecondary"}
                      borderRadius="$5"
                      size="$3"
                      onPress={() => setSelectedRating(rating)}
                    >
                      ★ {rating}+
                    </Button>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          </YStack>
        )}
      </YStack>

      {/* 검색 결과 */}
      <YStack flex={1}>
        {!hasSearchQuery ? (
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingHorizontal="$4"
          >
            <Search size={48} color="$textMuted" />
            <Typography
              variant="title"
              color="$textMuted"
              textAlign="center"
              marginTop="$3"
            >
              검색어를 입력하거나 필터를 선택해주세요
            </Typography>
            <Typography
              variant="body"
              color="$textMuted"
              textAlign="center"
              marginTop="$2"
            >
              제목과 내용에서 메모를 검색할 수 있습니다
            </Typography>
          </YStack>
        ) : isLoading ? (
          <Loading text="검색 중..." />
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
            <Typography variant="title" color="$textPrimary">
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body" color="$textMuted" marginTop="$2">
              다른 검색어나 필터를 시도해보세요
            </Typography>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}