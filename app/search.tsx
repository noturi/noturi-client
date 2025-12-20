import { Sheet, YStack } from 'tamagui';
import { useMemoSearch } from '~/features/search/model';
import {
  ActiveFilters,
  EmptyState,
  FilterOptions,
  MemoList,
  SearchInputBar,
} from '~/features/search/ui';

import { useCallback } from 'react';

import { Search } from '@tamagui/lucide-icons';

export default function SearchScreen() {
  const { filters, categories, memos } = useMemoSearch();

  const handleSearch = useCallback(() => {
    if (
      filters.debouncedSearchText.trim() ||
      filters.selectedCategoryId !== undefined ||
      filters.selectedYear !== undefined ||
      filters.selectedRating !== undefined
    ) {
      memos.refetch();
    }
  }, [filters, memos]);

  const onEndReached = useCallback(() => {
    if (memos.hasNextPage && !memos.isFetchingNextPage) memos.fetchNextPage();
  }, [memos]);

  const isIdle = !filters.hasSearchQuery;
  const hasResults = filters.hasSearchQuery && !memos.isLoading && memos.list.length > 0;
  const isEmpty = filters.hasSearchQuery && !memos.isLoading && memos.list.length === 0;

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <YStack borderBottomColor="$border" borderBottomWidth={1}>
        <YStack gap="$1" paddingHorizontal="$1" paddingVertical="$2">
          <SearchInputBar
            hasActiveFilters={filters.hasActiveFilters}
            searchText={filters.searchText}
            onChangeSearchText={filters.setSearchText}
            onPressSearch={handleSearch}
            onToggleFilters={filters.toggleFilters}
          />

          <ActiveFilters
            categories={categories.list}
            selectedCategoryId={filters.selectedCategoryId}
            selectedRating={filters.selectedRating}
            selectedYear={filters.selectedYear}
            onClearCategory={() => filters.setSelectedCategoryId(undefined)}
            onClearRating={() => filters.setSelectedRating(undefined)}
            onClearYear={() => filters.setSelectedYear(undefined)}
          />
        </YStack>
      </YStack>

      {/* 필터 시트 */}
      <Sheet
        dismissOnOverlayPress
        dismissOnSnapToBottom
        modal
        animation="quick"
        open={filters.showFilters}
        position={0}
        snapPoints={[40, 60]}
        snapPointsMode="percent"
        onOpenChange={(open: boolean) => filters.setShowFilters(open)}
      >
        <Sheet.Overlay
          animation="quick"
          backgroundColor="$backgroundOverlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Frame
          backgroundColor="$backgroundPrimary"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$1"
        >
          <FilterOptions
            categories={categories.list}
            selectedCategoryId={filters.selectedCategoryId}
            selectedRating={filters.selectedRating}
            selectedYear={filters.selectedYear}
            setSelectedCategoryId={filters.setSelectedCategoryId}
            setSelectedRating={filters.setSelectedRating}
            setSelectedYear={filters.setSelectedYear}
            show={true}
          />
        </Sheet.Frame>
      </Sheet>

      <YStack flex={1}>
        {isIdle && (
          <EmptyState
            icon={<Search color="$textMuted" size="$5" />}
            title="검색어를 입력하거나 필터를 선택해주세요"
          />
        )}

        {hasResults && (
          <MemoList
            isFetchingNextPage={memos.isFetchingNextPage}
            memos={memos.list}
            onEndReached={onEndReached}
          />
        )}

        {isEmpty && <EmptyState title="검색 결과가 없습니다" />}
      </YStack>
    </YStack>
  );
}
