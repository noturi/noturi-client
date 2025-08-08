import { Loading } from "@/components/ui";
import { Search } from "@tamagui/lucide-icons";
import { useCallback } from "react";
import { YStack } from "tamagui";
import {
  ActiveFilters,
  EmptyState,
  FilterOptions,
  MemoList,
  SearchInputBar,
} from "./_components";
import { useMemoSearch } from "./_lib/hooks/useMemoSearch";

export default function SearchScreen() {
  const { filters, categories, memos } = useMemoSearch();

  const handleSearch = useCallback(() => {
    if (
      filters.debouncedSearchText.trim() ||
      filters.selectedCategoryId ||
      filters.selectedRating !== undefined
    ) {
      memos.refetch();
    }
  }, [filters, memos]);

  const handleClearSearch = useCallback(() => {
    filters.clearAll();
  }, [filters]);

  const onEndReached = useCallback(() => {
    if (memos.hasNextPage && !memos.isFetchingNextPage) memos.fetchNextPage();
  }, [memos]);

  const isIdle = !filters.hasSearchQuery;
  const isLoading = filters.hasSearchQuery && memos.isLoading;
  const hasResults =
    filters.hasSearchQuery && !memos.isLoading && memos.list.length > 0;
  const isEmpty =
    filters.hasSearchQuery && !memos.isLoading && memos.list.length === 0;

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      {/* 검색 입력 */}
      <YStack
        padding="$4"
        gap="$3"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <SearchInputBar
          searchText={filters.searchText}
          onChangeSearchText={filters.setSearchText}
          hasActiveFilters={filters.hasActiveFilters}
          isSearchDisabled={
            !filters.hasActiveFilters && !filters.searchText.trim()
          }
          onPressSearch={handleSearch}
          onToggleFilters={filters.toggleFilters}
        />

        {/* 활성 필터 표시 */}
        <ActiveFilters
          selectedCategoryId={filters.selectedCategoryId}
          selectedRating={filters.selectedRating}
          categories={categories.list}
          onClearCategory={() => filters.setSelectedCategoryId("")}
          onClearRating={() => filters.setSelectedRating(undefined)}
          onClearAll={handleClearSearch}
        />

        {/* 필터 옵션 */}
        <FilterOptions
          show={filters.showFilters}
          categories={categories.list}
          selectedCategoryId={filters.selectedCategoryId}
          setSelectedCategoryId={filters.setSelectedCategoryId}
          selectedRating={filters.selectedRating}
          setSelectedRating={filters.setSelectedRating}
        />
      </YStack>

      <YStack flex={1}>
        {isIdle && (
          <EmptyState
            icon={<Search size={48} color="$textMuted" />}
            title="검색어를 입력하거나 필터를 선택해주세요"
            description="제목과 내용에서 메모를 검색할 수 있습니다"
          />
        )}

        {isLoading && <Loading text="검색 중..." />}

        {hasResults && (
          <MemoList
            memos={memos.list}
            onEndReached={onEndReached}
            isFetchingNextPage={memos.isFetchingNextPage}
          />
        )}

        {isEmpty && (
          <EmptyState
            title="검색 결과가 없습니다"
            description="다른 검색어나 필터를 시도해보세요"
          />
        )}
      </YStack>
    </YStack>
  );
}
