import { isSameDay } from 'date-fns';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, View } from 'react-native';

import { getDailyRate } from '../../lib/daily-stats';
import { formatYearMonth } from '../../lib/date-utils';
import { DailyStat } from '../../model/types';
import { CalendarSheet } from './calendar-sheet';
import { DateCell } from './date-cell';
import { useWeekPager } from './use-week-pager';

interface WeekDateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dailyStats?: DailyStat[];
}

const EMPTY_DAILY_STATS: DailyStat[] = [];

export function WeekDateSelector({
  selectedDate,
  onSelectDate,
  dailyStats = EMPTY_DAILY_STATS,
}: WeekDateSelectorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const {
    listRef,
    dates,
    itemWidth,
    visibleDate,
    getItemLayout,
    handleScrollBegin,
    handleScroll,
    handleScrollEnd,
  } = useWeekPager(selectedDate);

  const renderItem = ({ item: date }: ListRenderItemInfo<Date>) => (
    <DateCell
      date={date}
      isSelected={isSameDay(date, selectedDate)}
      progress={getDailyRate(dailyStats, date)}
      width={itemWidth}
      onPress={onSelectDate}
    />
  );

  return (
    <View className="gap-2">
      {/* 월 헤더 */}
      <Pressable className="items-center" onPress={() => setIsCalendarOpen(true)}>
        <Typography variant="title3" weight="semibold">
          {formatYearMonth(visibleDate)}
        </Typography>
      </Pressable>

      {/* 날짜 스크롤 */}
      <FlatList
        ref={listRef}
        horizontal
        data={dates}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        initialNumToRender={14}
        keyExtractor={(item) => item.toISOString()}
        maxToRenderPerBatch={14}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        windowSize={21}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
      />

      {/* 캘린더 바텀시트 */}
      <CalendarSheet
        isOpen={isCalendarOpen}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={onSelectDate}
      />
    </View>
  );
}
