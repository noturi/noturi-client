import { addDays, format, getDay, isSameDay, isToday } from 'date-fns';
import { CircularProgress, Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';

import { formatYearMonth, getDayLabel } from '../lib/date-utils';
import { DailyStat } from '../model/types';

interface WeekDateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dailyStats?: DailyStat[];
}

const DAYS_TO_RENDER = 365;
const ITEM_WIDTH = (Dimensions.get('window').width - 32) / 7;

export function WeekDateSelector({
  selectedDate,
  onSelectDate,
  dailyStats = [],
}: WeekDateSelectorProps) {
  const flatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const [visibleDate, setVisibleDate] = useState(selectedDate);

  // 중앙 기준으로 전후 날짜 생성
  const dates = useMemo(() => {
    const today = new Date();
    const result: Date[] = [];
    for (let i = -DAYS_TO_RENDER; i <= DAYS_TO_RENDER; i++) {
      result.push(addDays(today, i));
    }
    return result;
  }, []);

  // 선택된 날짜의 인덱스 찾기
  const selectedIndex = useMemo(() => {
    return dates.findIndex((date) => isSameDay(date, selectedDate));
  }, [dates, selectedDate]);

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current) {
      const offset = (selectedIndex - 3) * ITEM_WIDTH;
      flatListRef.current.scrollToOffset({ offset, animated: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 날짜가 변경되면 스크롤
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current && !isScrollingRef.current) {
      const offset = (selectedIndex - 3) * ITEM_WIDTH;
      flatListRef.current.scrollToOffset({ offset, animated: true });
    }
    setVisibleDate(selectedDate);
  }, [selectedIndex, selectedDate]);

  const getProgressForDate = useCallback(
    (date: Date): number => {
      const dateString = format(date, 'yyyy-MM-dd');
      const stat = dailyStats.find((s) => s.date === dateString);
      return stat?.rate ?? 0;
    },
    [dailyStats],
  );

  const renderItem = useCallback(
    ({ item: date }: { item: Date }) => {
      const isSelected = isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);
      const dayOfWeek = getDay(date);
      const progress = getProgressForDate(date);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      return (
        <Pressable
          className="items-center py-2"
          style={{ width: ITEM_WIDTH }}
          onPress={() => onSelectDate(date)}
        >
          <Typography
            className={
              isWeekend ? (dayOfWeek === 0 ? 'text-error' : 'text-accent') : 'text-text-secondary'
            }
            variant="caption2"
          >
            {getDayLabel(dayOfWeek)}
          </Typography>

          <View className="my-1">
            <CircularProgress progress={progress} size={36} strokeWidth={3}>
              <View
                className={`h-7 w-7 items-center justify-center rounded-full ${
                  isSelected ? 'bg-primary' : isTodayDate ? 'bg-accent/20' : ''
                }`}
              >
                <Typography
                  className={isSelected ? 'text-primary-text' : 'text-text-primary'}
                  variant="callout"
                  weight={isSelected || isTodayDate ? 'semibold' : 'regular'}
                >
                  {date.getDate()}
                </Typography>
              </View>
            </CircularProgress>
          </View>
        </Pressable>
      );
    },
    [selectedDate, getProgressForDate, onSelectDate],
  );

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const centerIndex = Math.round(offsetX / ITEM_WIDTH) + 3;
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

  return (
    <View className="gap-4">
      {/* 월 헤더 */}
      <View className="items-center">
        <Typography variant="title3" weight="semibold">
          {formatYearMonth(visibleDate)}
        </Typography>
      </View>

      {/* 날짜 스크롤 */}
      <FlatList
        ref={flatListRef}
        horizontal
        data={dates}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialNumToRender={14}
        keyExtractor={(item) => item.toISOString()}
        maxToRenderPerBatch={14}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        windowSize={21}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
      />
    </View>
  );
}
