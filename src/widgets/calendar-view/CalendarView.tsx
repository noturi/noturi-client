import { ScrollView, YStack } from 'tamagui';
import { CalendarMemo, calendarMemoMonthlyQuery } from '~/entities/calendar-memo';
import { setupKoreanLocale } from '~/shared/lib/calendar-locale';
import { Card, Typography } from '~/shared/ui';

import { useMemo, useState } from 'react';
import { Calendar, DateData } from 'react-native-calendars';

import { useQuery } from '@tanstack/react-query';

import { CalendarMemoList } from '../CalendarMemoList';
import { CALENDAR_THEME } from './constants';
import { useCalendarMarkings } from './useCalendarMarkings';

// 한국어 로케일 초기화
setupKoreanLocale();

export type CalendarViewProps = {
  onDateSelect?: (date: string) => void;
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
};

export function CalendarView({ onDateSelect, onDateRangeSelect }: CalendarViewProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  // 현재 표시 중인 월의 년/월 추출
  const currentDate = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    return { year, month };
  }, [currentMonth]);

  // 캘린더 메모 데이터 조회
  const {
    data: calendarMemosData,
    isPending: memosPending,
    error: memosError,
  } = useQuery(calendarMemoMonthlyQuery(currentDate));

  // 메모 데이터 변환
  const allMemos: CalendarMemo[] = useMemo(
    () => calendarMemosData?.data || [],
    [calendarMemosData],
  );

  const markedDates = useCalendarMarkings(allMemos, startDate, endDate);

  const handleDayPress = (day: DateData) => {
    const selectedDateString = day.dateString;

    // 같은 날짜 재선택 시 해제
    if (startDate === selectedDateString && !endDate) {
      setStartDate('');
      setEndDate('');
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // 새로운 선택 시작
      setStartDate(selectedDateString);
      setEndDate('');
      onDateSelect?.(selectedDateString);
    } else {
      // 종료일 선택
      const start = new Date(startDate);
      const end = new Date(selectedDateString);

      if (end >= start) {
        setEndDate(selectedDateString);
        onDateRangeSelect?.(startDate, selectedDateString);
      } else {
        // 시작일보다 이른 날짜 선택 시 새로운 시작일로 설정
        setStartDate(selectedDateString);
        setEndDate('');
        onDateSelect?.(selectedDateString);
      }
    }
  };

  const handleMonthChange = (month: DateData) => {
    setCurrentMonth(`${month.year}-${month.month.toString().padStart(2, '0')}`);
  };

  // 선택된 메모들 필터링
  const selectedMemos = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return allMemos.filter((memo) => {
        const memoDate = new Date(memo.startDate.split('T')[0]);
        return memoDate >= start && memoDate <= end;
      });
    } else if (startDate) {
      return allMemos.filter((memo) => memo.startDate.split('T')[0] === startDate);
    }
    return [];
  }, [allMemos, startDate, endDate]);

  const headerTitle = useMemo(() => {
    if (!startDate) return null;
    return startDate && endDate ? `${startDate} ~ ${endDate} 기간 일정` : `${startDate} 일정`;
  }, [startDate, endDate]);

  return (
    <YStack backgroundColor="$backgroundSecondary" flex={1} gap="$4">
      <Card>
        <Calendar
          markedDates={markedDates}
          markingType="period"
          monthFormat="yyyy년 MM월"
          theme={CALENDAR_THEME}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
        />
      </Card>

      <ScrollView flex={1}>
        <YStack gap="$3">
          {headerTitle && (
            <Typography color="$textPrimary" variant="headline">
              {headerTitle}
            </Typography>
          )}
          <CalendarMemoList
            endDate={endDate}
            isError={Boolean(memosError)}
            isLoading={memosPending}
            memos={selectedMemos}
            startDate={startDate}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
