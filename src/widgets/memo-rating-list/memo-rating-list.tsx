import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { CategoryFilterBar, type UICategory } from '~/entities/category';
import {
  RatingSectionHeader,
  RatingSectionMemoRow,
  RatingSectionSkeleton,
  type UIMemo,
} from '~/entities/memo';
import { EmptyStateCard } from '~/shared/ui';
import { YearFilterButton } from '~/widgets/year-filter';

import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { MemoContextMenu } from './memo-context-menu';
import { buildMemoRatingRows } from './memo-rating-rows';
import type { MemoRatingRow, RatingSection } from './types';

interface MemoRatingListProps {
  sections: RatingSection[];
  isLoading: boolean;
  /** 불러오기 실패 — 빈 상태 대신 다시 시도 안내 */
  isError: boolean;
  onRetry: () => void;
  categories: UICategory[];
  selectedYear?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
  onMemoPress: (memo: UIMemo) => void;
  /** 구역의 "전체" — 그 별점의 메모만 모아 보는 화면으로 */
  onPressMore: (rating: number) => void;
  /** 길게 누르기 메뉴(iOS) — 둘 다 있을 때만 표시 */
  onMemoEdit?: (memo: UIMemo) => void;
  onMemoDelete?: (memo: UIMemo) => void;
}

export function MemoRatingList({
  sections,
  isLoading,
  isError,
  onRetry,
  categories,
  selectedYear,
  onCategoryChange,
  onPressYear,
  onMemoPress,
  onPressMore,
  onMemoEdit,
  onMemoDelete,
}: MemoRatingListProps) {
  const listRef = useRef<FlashListRef<MemoRatingRow>>(null);
  const rows = buildMemoRatingRows(sections);

  // 카테고리·연도를 바꾸면 항상 맨 위(별 5개)부터
  const activeCategory = categories.find((category) => category.active)?.name;
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [activeCategory, selectedYear]);

  const renderRow = (row: MemoRatingRow) => {
    switch (row.type) {
      case 'header':
        return (
          <RatingSectionHeader
            rating={row.rating}
            total={row.total}
            onPressMore={row.hasMore ? () => onPressMore(row.rating) : undefined}
          />
        );
      case 'memo':
        return (
          <RatingSectionMemoRow
            memo={row.memo}
            wrapTitle={
              onMemoEdit && onMemoDelete
                ? (content) => (
                    <MemoContextMenu
                      onDelete={() => onMemoDelete(row.memo)}
                      onEdit={() => onMemoEdit(row.memo)}
                    >
                      {content}
                    </MemoContextMenu>
                  )
                : undefined
            }
            onPress={onMemoPress}
          />
        );
    }
  };

  // maintainVisibleContentPosition: 기본값(켜짐)이면 필터를 바꿀 때 보고 있던 구역(예: 별 1개)을
  // 화면에 붙잡아 두어 목록이 그 위치로 내려감 → 끄고 맨 위로
  return (
    <FlashList
      ref={listRef}
      contentContainerStyle={{ paddingBottom: 220 }}
      data={rows}
      getItemType={(row) => row.type}
      keyExtractor={(row) => row.key}
      ListEmptyComponent={
        isLoading ? (
          <View className="gap-8">
            <RatingSectionSkeleton />
            <RatingSectionSkeleton />
          </View>
        ) : isError ? (
          <Pressable onPress={onRetry}>
            <EmptyStateCard
              description="눌러서 다시 시도해 주세요"
              title="메모를 불러오지 못했어요"
            />
          </Pressable>
        ) : (
          <EmptyStateCard
            description="+ 버튼을 눌러 첫 메모를 남겨보세요"
            title="작성된 메모가 없어요"
          />
        )
      }
      ListHeaderComponent={
        // 필터(카테고리·연도)를 한 줄에 — 탭은 가로 스크롤, 연도는 오른쪽 고정
        <View className="flex-row items-center gap-3 pb-7">
          <View className="flex-1">
            <CategoryFilterBar categories={categories} onPress={onCategoryChange} />
          </View>
          <YearFilterButton selectedYear={selectedYear} onPressYear={onPressYear} />
        </View>
      }
      maintainVisibleContentPosition={{ disabled: true }}
      renderItem={({ item }) => (
        <View className={item.gapBefore ? 'pt-5' : undefined}>{renderRow(item)}</View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
