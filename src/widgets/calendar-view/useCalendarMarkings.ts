import { useMemo } from 'react';

import { CalendarMemo } from '@/entities/calendar-memo';

const SELECTION_COLOR = '#007AFF';

// 날짜 범위 생성 함수
const createDateRange = (start: string, end: string): string[] => {
  const dates = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// 메모 마킹 생성
const createMemoMarkings = (memos: CalendarMemo[]): Record<string, any> => {
  const markings: Record<string, any> = {};

  memos.forEach((memo) => {
    const date = memo.startDate.split('T')[0];
    if (!markings[date]) {
      markings[date] = {};
    }
    markings[date].marked = true;
    markings[date].dotColor = SELECTION_COLOR;
  });

  return markings;
};

// 선택 기간 마킹 생성
const createSelectionMarkings = (
  startDate: string,
  endDate: string,
  existingMarkings: Record<string, any>,
): Record<string, any> => {
  const markings = { ...existingMarkings };

  if (startDate && endDate) {
    const dateRange = createDateRange(startDate, endDate);
    dateRange.forEach((date, index) => {
      if (!markings[date]) markings[date] = {};

      if (dateRange.length === 1) {
        // 같은 날짜 선택
        markings[date] = { ...markings[date], selected: true, selectedColor: SELECTION_COLOR };
      } else if (index === 0) {
        // 시작일
        markings[date] = {
          ...markings[date],
          startingDay: true,
          color: SELECTION_COLOR,
          textColor: 'white',
        };
      } else if (index === dateRange.length - 1) {
        // 종료일
        markings[date] = {
          ...markings[date],
          endingDay: true,
          color: SELECTION_COLOR,
          textColor: 'white',
        };
      } else {
        // 중간 날짜
        markings[date] = { ...markings[date], color: SELECTION_COLOR, textColor: 'white' };
      }
    });
  } else if (startDate) {
    // 시작일만 선택된 상태
    if (!markings[startDate]) markings[startDate] = {};
    markings[startDate] = {
      ...markings[startDate],
      startingDay: true,
      endingDay: true,
      color: SELECTION_COLOR,
      textColor: 'white',
    };
  }

  return markings;
};

export const useCalendarMarkings = (memos: CalendarMemo[], startDate: string, endDate: string) => {
  return useMemo(() => {
    const memoMarkings = createMemoMarkings(memos);
    return createSelectionMarkings(startDate, endDate, memoMarkings);
  }, [memos, startDate, endDate]);
};
