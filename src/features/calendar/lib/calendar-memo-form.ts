import type { CalendarMemo, CreateCalendarMemoDto } from '~/entities/calendar';
import { formatDateTimeForApi } from '~/shared/lib/format';

import type { ActivePicker, CalendarMemoFormValues, PickerField, PickerType } from '../model/types';

/** 제목이 공백만이 아닌지 (저장 가능 여부) */
export function isCalendarMemoTitleValid(title: string): boolean {
  return title.trim().length > 0;
}

/** 폼 값 → 생성 DTO (제목 trim, 초/밀리초 제거, 알림 여부 계산) */
export function toCalendarMemoDto(values: CalendarMemoFormValues): CreateCalendarMemoDto {
  return {
    title: values.title.trim(),
    startDate: formatDateTimeForApi(values.startDateTime),
    endDate: formatDateTimeForApi(values.endDateTime),
    isAllDay: values.isAllDay,
    hasNotification: values.notifyBefore !== undefined,
    notifyBefore: values.notifyBefore,
  };
}

/** 수정 모드: 기존 일정 → 폼 값 */
export function fromCalendarMemo(memo: CalendarMemo): CalendarMemoFormValues {
  return {
    title: memo.title,
    startDateTime: new Date(memo.startDate),
    endDateTime: new Date(memo.endDate),
    isAllDay: memo.isAllDay,
    notifyBefore: memo.hasNotification ? memo.notifyBefore : undefined,
  };
}

/**
 * 생성 모드: 캘린더에서 선택한 날짜로 시작/종료 시각 계산
 * - 시작: 선택일의 (현재 시 + 1)시 정각
 * - 종료(기간 선택): 종료일의 (시작 시 + 1)시 정각
 * - 종료(단일 날짜): 시작 + 1시간
 */
export function getInitialDateRange(
  initialStartDate: string,
  initialEndDate?: string,
  now: Date = new Date(),
): { startDateTime: Date; endDateTime: Date } {
  const startDateTime = new Date(initialStartDate);
  startDateTime.setHours(now.getHours() + 1, 0, 0, 0);

  let endDateTime: Date;
  if (initialEndDate) {
    endDateTime = new Date(initialEndDate);
    endDateTime.setHours(startDateTime.getHours() + 1, 0, 0, 0);
  } else {
    endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1);
  }

  return { startDateTime, endDateTime };
}

/** 하루종일을 켤 때의 종료 시각: 시작 + 1시간 (분은 시작과 동일) */
export function getAllDayEndDateTime(startDateTime: Date): Date {
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(startDateTime.getHours() + 1);
  endDateTime.setMinutes(startDateTime.getMinutes());
  return endDateTime;
}

/** date의 날짜에 timeSource의 시/분을 입힌 새 Date (하루종일 날짜 동기화용) */
export function withTimeOf(date: Date, timeSource: Date): Date {
  const result = new Date(date);
  result.setHours(timeSource.getHours());
  result.setMinutes(timeSource.getMinutes());
  return result;
}

/** react-native-calendars minDate 형식 (UTC 기준 YYYY-MM-DD — 기존 동작 유지) */
export function toCalendarDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** 폼 전체 활성 피커 → 해당 필드의 피커 */
export function toFieldPicker(activePicker: ActivePicker, field: PickerField): PickerType {
  if (activePicker === `${field}-date`) return 'date';
  if (activePicker === `${field}-time`) return 'time';
  return null;
}

/** 필드의 피커 변경 → 폼 전체 활성 피커 */
export function toActivePicker(field: PickerField, picker: PickerType): ActivePicker {
  if (picker === 'date') return `${field}-date`;
  if (picker === 'time') return `${field}-time`;
  return null;
}
