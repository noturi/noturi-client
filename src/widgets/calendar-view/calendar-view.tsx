import { ScrollView, YStack } from 'tamagui';
import {
  CalendarMemo,
  CreateCalendarMemoDto,
  calendarMemoMonthlyQuery,
} from '~/entities/calendar-memo';
import {
  CalendarAddModal,
  CalendarFloatingButton,
  useCreateCalendarMemo,
} from '~/features/calendar';
import { useCalendarDate } from '~/shared/lib/calendar';
import { setupKoreanLocale } from '~/shared/lib/calendar-locale';
import { Card, Typography } from '~/shared/ui';

import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { useQuery } from '@tanstack/react-query';

import { CalendarMemoList } from '../calendar-memo-list';
import { CALENDAR_THEME } from './constants';
import { useCalendarMarkings } from './use-calendar-markings';

// 한국어 로케일 초기화
setupKoreanLocale();

export type CalendarViewProps = {
  onDateSelect?: (date: string) => void;
  onDateRangeSelect?: (startDate: string, endDate: string) => void;
};

export function CalendarView({ onDateSelect, onDateRangeSelect }: CalendarViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const createCalendarMemoMutation = useCreateCalendarMemo();

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

  const headerTitle = useMemo(() => {
    if (!startDate) return null;
    return startDate && endDate ? `${startDate} ~ ${endDate} 기간 일정` : `${startDate} 일정`;
  }, [startDate, endDate]);

  const handleAddCalendarMemo = async (data: CreateCalendarMemoDto) => {
    await createCalendarMemoMutation.mutateAsync(data);
  };

  const handleFloatingButtonPress = () => {
    console.log('플로팅 버튼 클릭됨, startDate:', startDate);
    if (!startDate) {
      console.log('날짜가 선택되지 않음');
      Alert.alert(
        '날짜를 먼저 선택해주세요',
        '캘린더에서 날짜를 선택한 후 일정을 추가할 수 있습니다.',
        [{ text: '확인' }],
      );
      return;
    }
    console.log('모달 열기 시도');
    setIsAddModalOpen(true);
  };

  return (
    <YStack flex={1} gap="$4" paddingHorizontal="$4" paddingTop="$4" position="relative">
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

      <YStack bottom={140} position="absolute" right="$4">
        <CalendarFloatingButton onPress={handleFloatingButtonPress} />
      </YStack>

      <CalendarAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCalendarMemo}
      />
    </YStack>
  );
}
