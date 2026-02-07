import { addDays, format, getDay, isSameDay, isToday } from 'date-fns';
import { CircularProgress, Typography } from '~/shared/ui';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { formatYearMonth, getDayLabel } from '../lib/date-utils';
import { DailyStat } from '../model/types';

interface WeekDateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dailyStats?: DailyStat[];
}

// 레이아웃 상수
const DAYS_TO_RENDER = 365;
const VISIBLE_DAYS = 7;
const HORIZONTAL_PADDING = 32;
const CENTER_OFFSET = Math.floor(VISIBLE_DAYS / 2);
const ITEM_WIDTH = (Dimensions.get('window').width - HORIZONTAL_PADDING) / VISIBLE_DAYS;

// 날짜 원 크기 상수
const CIRCLE_SIZE = 36;
const PROGRESS_STROKE = 3;
const TODAY_INNER_SIZE = 30;
const TODAY_DOT_SIZE = 4;
const TODAY_DOT_MARGIN = 3;

function getScrollOffset(index: number): number {
  return (index - CENTER_OFFSET) * ITEM_WIDTH;
}

// --- DateCell 컴포넌트: 각 날짜 셀의 선택 애니메이션 담당 ---

interface DateCellProps {
  date: Date;
  isSelected: boolean;
  progress: number;
  onPress: (date: Date) => void;
}

const DateCell = memo(function DateCell({ date, isSelected, progress, onPress }: DateCellProps) {
  const isTodayDate = isToday(date);
  const dayOfWeek = getDay(date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const prevSelectedRef = useRef(isSelected);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSelected && !prevSelectedRef.current) {
      scale.value = withSequence(
        withTiming(0.8, { duration: 80 }),
        withTiming(1.1, { duration: 120 }),
        withTiming(1, { duration: 100 }),
      );
    }
    prevSelectedRef.current = isSelected;
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      className="items-center py-2"
      style={{ width: ITEM_WIDTH }}
      onPress={() => onPress(date)}
    >
      <Typography
        className={
          isWeekend ? (dayOfWeek === 0 ? 'text-error' : 'text-accent') : 'text-text-secondary'
        }
        variant="caption2"
      >
        {getDayLabel(dayOfWeek)}
      </Typography>

      <View className="my-1 items-center">
        {isSelected ? (
          <Animated.View
            className="items-center justify-center rounded-full bg-primary"
            style={[{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }, animatedStyle]}
          >
            <Typography className="!text-primary-text" variant="callout" weight="semibold">
              {date.getDate()}
            </Typography>
          </Animated.View>
        ) : (
          <CircularProgress progress={progress} size={CIRCLE_SIZE} strokeWidth={PROGRESS_STROKE}>
            {isTodayDate ? (
              <View
                className="items-center justify-center rounded-full bg-primary/15"
                style={{ width: TODAY_INNER_SIZE, height: TODAY_INNER_SIZE }}
              >
                <Typography variant="callout" weight="semibold">
                  {date.getDate()}
                </Typography>
              </View>
            ) : (
              <Typography variant="callout">{date.getDate()}</Typography>
            )}
          </CircularProgress>
        )}
        <View
          style={{ width: TODAY_DOT_SIZE, height: TODAY_DOT_SIZE, marginTop: TODAY_DOT_MARGIN }}
        >
          {isTodayDate && !isSelected && (
            <View
              className="rounded-full bg-accent"
              style={{ width: TODAY_DOT_SIZE, height: TODAY_DOT_SIZE }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
});

// --- WeekDateSelector ---

export function WeekDateSelector({
  selectedDate,
  onSelectDate,
  dailyStats = [],
}: WeekDateSelectorProps) {
  const flatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);
  const [visibleDate, setVisibleDate] = useState(selectedDate);

  const dates = useMemo(() => {
    const today = new Date();
    const result: Date[] = [];
    for (let i = -DAYS_TO_RENDER; i <= DAYS_TO_RENDER; i++) {
      result.push(addDays(today, i));
    }
    return result;
  }, []);

  const selectedIndex = useMemo(() => {
    return dates.findIndex((date) => isSameDay(date, selectedDate));
  }, [dates, selectedDate]);

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: getScrollOffset(selectedIndex),
        animated: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 날짜가 변경되면 스크롤
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current && !isScrollingRef.current) {
      flatListRef.current.scrollToOffset({
        offset: getScrollOffset(selectedIndex),
        animated: true,
      });
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
      const progress = getProgressForDate(date);

      return (
        <DateCell date={date} isSelected={isSelected} progress={progress} onPress={onSelectDate} />
      );
    },
    [selectedDate, getProgressForDate, onSelectDate],
  );

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const centerIndex = Math.round(offsetX / ITEM_WIDTH) + CENTER_OFFSET;
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
