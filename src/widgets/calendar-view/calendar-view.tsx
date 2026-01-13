import { useUserTheme } from '~/application/providers/theme-provider';
import { calendarMemoMonthlyQuery } from '~/entities/calendar/api/queries';
import { useCalendarDate } from '~/entities/calendar/model';
import type { CalendarMemo, CreateCalendarMemoDto } from '~/entities/calendar/model/types';
import { useCreateCalendarMemo } from '~/features/calendar/api/mutations';
import { CalendarAddModal } from '~/features/calendar/ui/calendar-add-modal';
import { setupKoreanLocale } from '~/shared/config/calendar-locale';
import { Card, Typography } from '~/shared/ui';

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { useQuery } from '@tanstack/react-query';

import { CalendarMemoList } from '../calendar-memo-list';
import { createCalendarTheme } from './constants';
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
    const { hexColors } = useUserTheme();
    const calendarTheme = useMemo(() => createCalendarTheme(hexColors), [hexColors]);

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

    const markedDates = useCalendarMarkings(allMemos, startDate, endDate, hexColors);

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

    // 해당 월의 모든 메모 표시 (날짜 선택과 관계없이)
    const displayMemos = allMemos;

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
      <View className="flex-1 gap-4 pb-10 relative">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View className="gap-4">
            <Card>
              <Calendar
                key={hexColors.bgPrimary}
                markedDates={markedDates}
                markingType="period"
                monthFormat="yyyy년 MM월"
                theme={calendarTheme}
                onDayPress={handleDayPress}
                onMonthChange={handleMonthChange}
              />
            </Card>
            <View className="gap-2">
              <CalendarMemoList
                endDate={endDate}
                isError={Boolean(memosError)}
                isLoading={memosPending}
                memos={displayMemos}
                startDate={startDate}
              />
            </View>
          </View>
        </ScrollView>

        <CalendarAddModal
          initialEndDate={endDate}
          initialStartDate={startDate}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCalendarMemo}
        />
      </View>
    );
  },
);

CalendarView.displayName = 'CalendarView';
