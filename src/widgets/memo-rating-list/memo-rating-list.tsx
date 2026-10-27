import { FlashList, type FlashListRef, type ViewToken } from '@shopify/flash-list';
import type { UICategory } from '~/entities/category';
import {
  CategoryFilterBar,
  RatingGroupCardSkeleton,
  RatingGroupFooterRow,
  RatingGroupHeaderRow,
  RatingGroupMemoRow,
  type UIMemo,
} from '~/entities/memo';
import { DURATION } from '~/shared/config';
import { Typography } from '~/shared/ui';
import { MemoListHeader } from '~/widgets/memo-list-with-year-filter';

import { useRef, useState } from 'react';
import { LayoutAnimation, View } from 'react-native';

import { buildMemoRatingRows, selectGroupsToFetch } from './memo-rating-rows';
import type { MemoRatingRow, RatingGroup } from './types';

/** 행이 1px이라도 보이면 viewable — 끝 근처 메모 행이 화면에 들어오는 즉시 미리 요청 */
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 0 };
/** 펼침/접힘: 기존 카드 높이 애니메이션(250ms, ease-out)과 비슷한 길이 */
const TOGGLE_LAYOUT_ANIMATION = LayoutAnimation.create(
  DURATION.d5,
  LayoutAnimation.Types.easeOut,
  LayoutAnimation.Properties.opacity,
);

interface MemoRatingListProps {
  ratingGroups: RatingGroup[];
  categories: UICategory[];
  selectedYear?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
  onMemoPress: (memo: UIMemo) => void;
}

export function MemoRatingList({
  ratingGroups,
  categories,
  selectedYear,
  onCategoryChange,
  onPressYear,
  onMemoPress,
}: MemoRatingListProps) {
  const listRef = useRef<FlashListRef<MemoRatingRow>>(null);
  // 그룹은 기본 펼침 — 사용자가 접은 그룹만 기록한다
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  const rows = buildMemoRatingRows(ratingGroups, collapsedGroups);

  const fetchGroups = (visibleRows: MemoRatingRow[]) => {
    for (const group of selectGroupsToFetch(visibleRows, ratingGroups)) {
      group.fetchNextPage();
    }
  };

  const handleViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<MemoRatingRow>[];
  }) => {
    fetchGroups(viewableItems.flatMap((token) => (token.item ? [token.item] : [])));
  };

  // 안전망: 마지막 카드가 펼쳐져 있으면 끝(footer) 근처에서 다음 페이지 요청
  const handleEndReached = () => {
    const lastRow = rows.at(-1);
    if (lastRow) fetchGroups([lastRow]);
  };

  const handleToggle = (rating: number) => {
    // 행이 추가/제거되는 다음 커밋을 LayoutAnimation으로 보간 — 재활용을 끄지 않으면
    // 셀이 다른 행으로 바뀌며 엉뚱한 위치에서 애니메이션된다 (레이아웃 커밋 후 자동 복구)
    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(TOGGLE_LAYOUT_ANIMATION);
    setCollapsedGroups((prev) => ({ ...prev, [rating]: !prev[rating] }));
  };

  const renderRow = (row: MemoRatingRow) => {
    switch (row.type) {
      case 'skeleton':
        return <RatingGroupCardSkeleton />;
      case 'header':
        return (
          <RatingGroupHeaderRow
            isExpanded={row.isExpanded}
            rating={row.rating}
            total={row.total}
            onToggle={() => handleToggle(row.rating)}
          />
        );
      case 'memo':
        return <RatingGroupMemoRow memo={row.memo} onPress={onMemoPress} />;
      case 'footer':
        return <RatingGroupFooterRow isFetchingNextPage={row.isFetchingNextPage} />;
    }
  };

  return (
    <FlashList
      ref={listRef}
      contentContainerStyle={{ paddingBottom: 220 }}
      data={rows}
      getItemType={(row) => row.type}
      keyExtractor={(row) => row.key}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <Typography className="text-text-muted" variant="callout">
            작성된 메모가 없습니다
          </Typography>
        </View>
      }
      ListHeaderComponent={
        <View className="gap-6 pb-3">
          <CategoryFilterBar categories={categories} onPress={onCategoryChange} />
          {rows.length > 0 && (
            <MemoListHeader selectedYear={selectedYear} onPressYear={onPressYear} />
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View className={item.gapBefore ? 'pt-4' : undefined}>{renderRow(item)}</View>
      )}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={VIEWABILITY_CONFIG}
      onEndReached={handleEndReached}
      onViewableItemsChanged={handleViewableItemsChanged}
    />
  );
}
