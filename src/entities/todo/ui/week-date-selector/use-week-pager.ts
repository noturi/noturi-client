import { isSameDay } from 'date-fns';

import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';

import {
  getCenterIndexFromOffset,
  getDateItemWidth,
  getScrollOffsetForIndex,
} from '../../lib/date-strip-layout';
import { findSameDayIndex, getDateRange } from '../../lib/date-utils';
import { CENTER_OFFSET, DAYS_TO_RENDER, HORIZONTAL_PADDING, VISIBLE_DAYS } from './constants';

/**
 * 가로 날짜 스트립의 스크롤 상태 관리
 * - 선택 날짜가 바뀌면 해당 셀을 가운데로 스크롤 (최초 1회는 애니메이션 없이)
 * - 사용자가 스크롤하는 동안 가운데 셀의 날짜를 visibleDate로 노출 (월 헤더용)
 */
export function useWeekPager(selectedDate: Date) {
  const { width: windowWidth } = useWindowDimensions();
  const itemWidth = getDateItemWidth(windowWidth, HORIZONTAL_PADDING, VISIBLE_DAYS);

  // 마운트 시점의 오늘 기준으로 한 번만 생성
  const [dates] = useState(() => getDateRange(new Date(), DAYS_TO_RENDER));

  const listRef = useRef<FlatList<Date>>(null);
  const isScrollingRef = useRef(false);
  const hasInitialScrollRef = useRef(false);

  // 선택 날짜가 바뀌면 헤더도 선택 날짜로 되돌린다 (렌더 중 상태 조정 패턴)
  const [visibleDate, setVisibleDate] = useState(selectedDate);
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);
  if (prevSelectedDate !== selectedDate) {
    setPrevSelectedDate(selectedDate);
    setVisibleDate(selectedDate);
  }

  useEffect(() => {
    const isInitialScroll = !hasInitialScrollRef.current;
    hasInitialScrollRef.current = true;

    const index = findSameDayIndex(dates, selectedDate);
    if (index < 0 || !listRef.current) return;
    // 사용자가 드래그 중이면 스크롤을 빼앗지 않는다 (최초 위치 설정은 예외)
    if (!isInitialScroll && isScrollingRef.current) return;

    listRef.current.scrollToOffset({
      offset: getScrollOffsetForIndex(index, itemWidth, CENTER_OFFSET),
      animated: !isInitialScroll,
    });
  }, [dates, selectedDate, itemWidth]);

  const getItemLayout = (_data: unknown, index: number) => ({
    length: itemWidth,
    offset: itemWidth * index,
    index,
  });

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const centerIndex = getCenterIndexFromOffset(
      event.nativeEvent.contentOffset.x,
      itemWidth,
      CENTER_OFFSET,
    );
    if (centerIndex >= 0 && centerIndex < dates.length) {
      const centerDate = dates[centerIndex];
      if (!isSameDay(centerDate, visibleDate)) {
        setVisibleDate(centerDate);
      }
    }
  };

  const handleScrollEnd = () => {
    isScrollingRef.current = false;
  };

  return {
    listRef,
    dates,
    itemWidth,
    visibleDate,
    getItemLayout,
    handleScrollBegin,
    handleScroll,
    handleScrollEnd,
  };
}
