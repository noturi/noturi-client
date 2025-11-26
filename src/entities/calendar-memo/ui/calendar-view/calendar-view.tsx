import { ScrollView, YStack } from 'tamagui';
import { calendarMemoMonthlyQuery } from '~/entities/calendar-memo/api/queries';
import type { CalendarMemo, CreateCalendarMemoDto } from '~/entities/calendar-memo/model/types';
import { useCreateCalendarMemo } from '~/features/calendar/api/mutations';
import { CalendarAddModal } from '~/features/calendar/ui/calendar-add-modal';
import { setupKoreanLocale } from '~/shared/config/calendar-locale';
import { useCalendarDate } from '~/shared/lib/calendar';
import { Card, Typography } from '~/shared/ui';

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { useQuery } from '@tanstack/react-query';

import { CalendarMemoList } from '../calendar-memo-list/ui/calendar-memo-list';
import { CALENDAR_THEME } from './constants';
import { useCalendarMarkings } from './use-calendar-markings';

setupKoreanLocale();

export type CalendarViewProps = {
  onDateSelect?: (date: string) => void;
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
};

export type CalendarViewRef = {
  handleFloatingButtonPress: () => void;
};

export const CalendarView = forwardRef<CalendarViewRef, CalendarViewProps>(
  ({ onDateSelect, onDateRangeSelect }, ref) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const createCalendarMemoMutation = useCreateCalendarMemo();

    useImperativeHandle(ref, () => ({
      handleFloatingButtonPress,
    }));

    const {
      startDate,
      endDate,
      currentMonth,
      setStartDate,
      setEndDate,
      setCurrentMonth,
      clearSelection,
    } = useCalendarDate();

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
        clearSelection();
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
        // 기간 선택: 선택된 기간과 겹치는 모든 일정
        const start = new Date(startDate);
        const end = new Date(endDate);
        return allMemos.filter((memo) => {
          const memoStart = new Date(memo.startDate.split('T')[0]);
          const memoEnd = new Date(memo.endDate.split('T')[0]);
          // 일정과 선택 기간이 겹치는지 확인
          return memoStart <= end && memoEnd >= start;
        });
      } else if (startDate) {
        // 단일 날짜 선택: 해당 날짜에 포함되는 모든 일정
        const selectedDate = new Date(startDate);
        return allMemos.filter((memo) => {
          const memoStart = new Date(memo.startDate.split('T')[0]);
          const memoEnd = new Date(memo.endDate.split('T')[0]);
          // 선택된 날짜가 일정의 시작일~종료일 범위 안에 있는지 확인
          return selectedDate >= memoStart && selectedDate <= memoEnd;
        });
      }
      return [];
    }, [allMemos, startDate, endDate]);

    const formatDisplayDate = (dateString: string) => {
      const [year, month, day] = dateString.split('-');
      return `${year}. ${month}. ${day}`;
    };

    const headerTitle = useMemo(() => {
      if (!startDate) return null;
      const formattedStart = formatDisplayDate(startDate);
      if (endDate) {
        const formattedEnd = formatDisplayDate(endDate);
        return `${formattedStart} ~ ${formattedEnd}`;
      }
      return formattedStart;
    }, [startDate, endDate]);

    const handleAddCalendarMemo = async (data: CreateCalendarMemoDto) => {
      await createCalendarMemoMutation.mutateAsync(data);
    };

    const handleFloatingButtonPress = () => {
      if (!startDate) {
        Alert.alert(
          '날짜를 먼저 선택해주세요',
          '캘린더에서 날짜를 선택한 후 일정을 추가할 수 있습니다.',
          [{ text: '확인' }],
        );
        return;
      }

      setIsAddModalOpen(true);
    };

    return (
      <YStack flex={1} gap="$4" paddingBottom="$10" position="relative">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} flex={1}>
          <YStack gap="$4">
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
            <YStack gap="$2">
              {headerTitle && (
                <Typography color="$textPrimary" variant="subheadline">
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
          </YStack>
        </ScrollView>

        <CalendarAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCalendarMemo}
        />
      </YStack>
    );
  },
);

CalendarView.displayName = 'CalendarView';
