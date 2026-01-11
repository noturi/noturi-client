import { CalendarMemo } from '~/entities/calendar';
import type { HexColors } from '~/shared/config/theme';

import { useMemo } from 'react';

// 일정 밀도 색상 (고정 - 테마와 무관)
const SCHEDULE_COLORS = {
  LIGHT: '#007AFF',
  MODERATE: '#FFC107',
  BUSY: '#FF9800',
  OVERLOAD: '#FF5722',
} as const;

const SCHEDULE_DENSITY_THRESHOLDS = {
  LIGHT: 1,
  MODERATE: 2,
  BUSY: 3,
  OVERLOAD: 4,
} as const;

// 유틸리티: 기간 내 모든 날짜 생성
const generateDateRangeInclusive = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// 비즈니스 로직: 각 날짜별 일정 밀도 계산
const calculateScheduleDensityByDate = (memos: CalendarMemo[]): Record<string, number> => {
  const densityByDate: Record<string, number> = {};

  memos.forEach((memo) => {
    const affectedDates = getAffectedDatesByMemo(memo);

    affectedDates.forEach((date) => {
      densityByDate[date] = (densityByDate[date] || 0) + 1;
    });
  });

  return densityByDate;
};

// 비즈니스 로직: 메모가 영향을 주는 모든 날짜 추출
const getAffectedDatesByMemo = (memo: CalendarMemo): string[] => {
  const startDate = memo.startDate.split('T')[0];
  const endDate = memo.endDate.split('T')[0];

  const isSingleDayEvent = startDate === endDate;
  const isPeriodEvent = !isSingleDayEvent;

  if (isPeriodEvent) {
    // 기간 일정: 시작일부터 종료일까지 모든 날짜에 영향
    return generateDateRangeInclusive(startDate, endDate);
  } else {
    // 단일 날짜 일정: 해당 날짜만 영향
    return [startDate];
  }
};

// 비즈니스 로직: 일정 밀도에 따른 시각적 표현 결정
const determineScheduleVisualization = (density: number) => {
  if (density >= SCHEDULE_DENSITY_THRESHOLDS.OVERLOAD) {
    return {
      type: 'OVERLOAD' as const,
      color: SCHEDULE_COLORS.OVERLOAD,
      text: `${density}+`,
      description: '과부하 상태',
    };
  } else if (density === SCHEDULE_DENSITY_THRESHOLDS.BUSY) {
    return {
      type: 'BUSY' as const,
      color: SCHEDULE_COLORS.BUSY,
      text: density.toString(),
      description: '바쁜 상태',
    };
  } else if (density === SCHEDULE_DENSITY_THRESHOLDS.MODERATE) {
    return {
      type: 'MODERATE' as const,
      color: SCHEDULE_COLORS.MODERATE,
      text: density.toString(),
      description: '보통 상태',
    };
  } else if (density === SCHEDULE_DENSITY_THRESHOLDS.LIGHT) {
    return {
      type: 'LIGHT' as const,
      color: SCHEDULE_COLORS.LIGHT,
      text: null,
      description: '여유 상태',
    };
  }

  return null;
};

// UI 레이어: 캘린더 마킹 생성
const createCalendarMarkingsWithSelection = (
  userSelectedStartDate: string,
  userSelectedEndDate: string,
  scheduleDensityByDate: Record<string, number>,
  hexColors: HexColors,
): Record<string, any> => {
  const markings: Record<string, any> = {};

  // 1단계: 일정 밀도에 따른 시각적 표시
  Object.entries(scheduleDensityByDate).forEach(([date, density]) => {
    const visualization = determineScheduleVisualization(density);

    if (!visualization) return;

    if (!markings[date]) markings[date] = {};

    markings[date].marked = true;
    markings[date].dotColor = visualization.color;

    if (visualization.text) {
      markings[date].customStyles = {
        text: {
          color: visualization.color,
          fontSize: 8,
          fontWeight: 'bold',
          marginTop: 8,
        },
      };
      markings[date].customText = visualization.text;
    }
  });

  // 2단계: 사용자 선택 영역 표시 (일정 표시 위에 오버레이)
  applyUserSelectionOverlay(markings, userSelectedStartDate, userSelectedEndDate, hexColors);

  return markings;
};

// UI 레이어: 사용자 선택 영역 오버레이 적용
const applyUserSelectionOverlay = (
  markings: Record<string, any>,
  startDate: string,
  endDate: string,
  hexColors: HexColors,
): void => {
  const hasDateRangeSelection = startDate && endDate;
  const hasSingleDateSelection = startDate && !endDate;

  if (hasDateRangeSelection) {
    const selectedDateRange = generateDateRangeInclusive(startDate, endDate);

    selectedDateRange.forEach((date, index) => {
      if (!markings[date]) markings[date] = {};

      const isFirstDate = index === 0;
      const isLastDate = index === selectedDateRange.length - 1;
      const isSingleDateRange = selectedDateRange.length === 1;

      if (isSingleDateRange) {
        // 단일 날짜 선택
        markings[date] = {
          ...markings[date],
          selected: true,
          selectedColor: hexColors.primary,
        };
      } else if (isFirstDate) {
        // 기간 선택 시작일
        markings[date] = {
          ...markings[date],
          startingDay: true,
          color: hexColors.primary,
          textColor: hexColors.primaryText,
        };
      } else if (isLastDate) {
        // 기간 선택 종료일
        markings[date] = {
          ...markings[date],
          endingDay: true,
          color: hexColors.primary,
          textColor: hexColors.primaryText,
        };
      } else {
        // 기간 선택 중간 날짜
        markings[date] = {
          ...markings[date],
          color: hexColors.primary,
          textColor: hexColors.primaryText,
        };
      }
    });
  } else if (hasSingleDateSelection) {
    // 시작일만 선택된 상태 (기간 선택 중)
    if (!markings[startDate]) markings[startDate] = {};
    markings[startDate] = {
      ...markings[startDate],
      startingDay: true,
      endingDay: true,
      color: hexColors.primary,
      textColor: hexColors.primaryText,
    };
  }
};

// 메인 비즈니스 로직: 캘린더 마킹 계산
export const useCalendarMarkings = (
  memos: CalendarMemo[],
  userSelectedStartDate: string,
  userSelectedEndDate: string,
  hexColors: HexColors,
) => {
  return useMemo(() => {
    // 1단계: 일정 데이터 분석 - 각 날짜별 일정 밀도 계산
    const scheduleDensityByDate = calculateScheduleDensityByDate(memos);

    // 2단계: UI 렌더링 - 밀도 + 사용자 선택에 따른 캘린더 마킹 생성
    return createCalendarMarkingsWithSelection(
      userSelectedStartDate,
      userSelectedEndDate,
      scheduleDensityByDate,
      hexColors,
    );
  }, [memos, userSelectedStartDate, userSelectedEndDate, hexColors]);
};
