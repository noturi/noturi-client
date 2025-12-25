import { Search } from 'lucide-react-native';
import { useMemoSearch } from '~/features/search/model';
import {
  ActiveFilters,
  EmptyState,
  FilterOptions,
  MemoList,
  SearchInputBar,
} from '~/features/search/ui';
import { useUserTheme } from '~/features/theme';
import { ControlledSheet } from '~/shared/ui';

import { useCallback } from 'react';
import { View } from 'react-native';

export default function SearchScreen() {
  const { filters, categories, memos } = useMemoSearch();
  const { currentTheme } = useUserTheme();
  const mutedColor = `rgb(${currentTheme.colors.textMuted})`;

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
    <View className="flex-1 bg-bg-primary">
      <View className="border-b border-border">
        <View className="gap-1 px-1 py-2">
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
        </View>
      </View>

      <ControlledSheet
        isOpen={filters.showFilters}
        snapPoints={['40%', '60%']}
        onClose={() => filters.setShowFilters(false)}
      >
        <View className="p-1">
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
        </View>
      </ControlledSheet>

      <View className="flex-1">
        {isIdle && (
          <EmptyState
            icon={<Search color={mutedColor} size={24} />}
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
      </View>
    </View>
  );
}
