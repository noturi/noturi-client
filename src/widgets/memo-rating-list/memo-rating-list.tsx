import type { UICategory } from '~/entities/category';
import { CategoryFilterBar, MemoRatingGroupView } from '~/entities/memo';
import type { RatingGroupData } from '~/entities/memo';
import { MemoListHeader } from '~/widgets/memo-list-with-year-filter';

import { useRef } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { type ScrollViewport, isSentinelInViewport } from './is-sentinel-in-viewport';

/** 센티넬이 뷰포트 하단에서 이 거리(px) 안에 들어오면 다음 페이지를 요청 */
const PAGINATION_THRESHOLD = 200;
/** onScroll 이벤트 간격(ms) — 판정 범위(뷰포트 + threshold)가 넓어 100ms면 충분 */
const SCROLL_EVENT_THROTTLE = 100;

interface MemoRatingListProps {
  ratingGroups: RatingGroupData[];
  categories: UICategory[];
  selectedYear?: number;
  onCategoryChange: (category: string) => void;
  onPressYear: () => void;
}

export function MemoRatingList({
  ratingGroups,
  categories,
  selectedYear,
  onCategoryChange,
  onPressYear,
}: MemoRatingListProps) {
  // 스크롤 컨텐츠 루트 — 센티넬 위치를 이 뷰 기준(컨텐츠 좌표)으로 측정한다
  const contentRef = useRef<View>(null);
  // 펼쳐져 있고 다음 페이지가 있는 그룹의 끝 센티넬 (rating → View)
  const sentinelsRef = useRef(new Map<number, View>());
  const viewportRef = useRef<ScrollViewport>({ offsetY: 0, height: 0 });

  // 스크롤/레이아웃 이벤트에서만 호출 — 타이머 없음
  const loadVisibleGroups = () => {
    const content = contentRef.current;
    if (!content) return;

    for (const group of ratingGroups) {
      if (!group.hasNextPage || group.isFetchingNextPage) continue;
      const sentinel = sentinelsRef.current.get(group.rating);
      if (!sentinel) continue;

      // 매번 재측정: 위쪽 그룹의 펼침/접힘 애니메이션으로 위치가 바뀌어도 캐시가 낡지 않는다
      sentinel.measureLayout(content, (_x, y) => {
        if (isSentinelInViewport(y, viewportRef.current, PAGINATION_THRESHOLD)) {
          group.fetchNextPage();
        }
      });
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    viewportRef.current = { offsetY: contentOffset.y, height: layoutMeasurement.height };
    loadVisibleGroups();
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    viewportRef.current = { ...viewportRef.current, height: e.nativeEvent.layout.height };
    loadVisibleGroups();
  };

  const registerSentinel = (rating: number, node: View | null) => {
    if (node) sentinelsRef.current.set(rating, node);
    else sentinelsRef.current.delete(rating);
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      onContentSizeChange={loadVisibleGroups}
      onLayout={handleLayout}
      onScroll={handleScroll}
    >
      <View ref={contentRef} className="gap-6" collapsable={false}>
        <CategoryFilterBar categories={categories} onPress={onCategoryChange} />
        <MemoRatingGroupView
          endSentinelRef={registerSentinel}
          header={<MemoListHeader selectedYear={selectedYear} onPressYear={onPressYear} />}
          ratingGroups={ratingGroups}
          onEndSentinelLayout={loadVisibleGroups}
          onMemoPress={(memo) => router.push(`/memo/${memo.id}`)}
        />
      </View>
    </ScrollView>
  );
}
