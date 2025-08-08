import { YStack } from 'tamagui';

import { useCallback } from 'react';

import { Search } from '@tamagui/lucide-icons';

import { Loading } from '@/components/ui';

import { ActiveFilters, EmptyState, FilterOptions, MemoList, SearchInputBar } from './_components';
import { useMemoSearch } from './_lib/hooks/useMemoSearch';

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
  const hasResults = filters.hasSearchQuery && !memos.isLoading && memos.list.length > 0;
  const isEmpty = filters.hasSearchQuery && !memos.isLoading && memos.list.length === 0;

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      {/* 검색 입력 */}
      <YStack borderBottomColor="$border" borderBottomWidth={1} gap="$3" padding="$4">
        <SearchInputBar
          hasActiveFilters={filters.hasActiveFilters}
          searchText={filters.searchText}
          onChangeSearchText={filters.setSearchText}
          onPressSearch={handleSearch}
          onToggleFilters={filters.toggleFilters}
        />

        {/* 활성 필터 표시 */}
        <ActiveFilters
          categories={categories.list}
          selectedCategoryId={filters.selectedCategoryId}
          selectedRating={filters.selectedRating}
          onClearAll={handleClearSearch}
          onClearCategory={() => filters.setSelectedCategoryId('')}
          onClearRating={() => filters.setSelectedRating(undefined)}
        />

        {/* 필터 옵션 */}
        <FilterOptions
          categories={categories.list}
          selectedCategoryId={filters.selectedCategoryId}
          selectedRating={filters.selectedRating}
          setSelectedCategoryId={filters.setSelectedCategoryId}
          setSelectedRating={filters.setSelectedRating}
          show={filters.showFilters}
        />
      </YStack>

      <YStack flex={1}>
        {isIdle && (
          <EmptyState
            description="제목과 내용에서 메모를 검색할 수 있습니다"
            icon={<Search color="$textMuted" size={48} />}
            title="검색어를 입력하거나 필터를 선택해주세요"
          />
        )}

        {isLoading && <Loading text="검색 중..." />}

        {hasResults && (
          <MemoList
            isFetchingNextPage={memos.isFetchingNextPage}
            memos={memos.list}
            onEndReached={onEndReached}
          />
        )}

        {isEmpty && (
          <EmptyState
            description="다른 검색어나 필터를 시도해보세요"
            title="검색 결과가 없습니다"
          />
        )}
      </YStack>
    </YStack>
  );
}
