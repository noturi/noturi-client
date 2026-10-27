import type { NotifyBefore } from '~/entities/calendar';

/** DateTimePickerField 한 칸에서 열려 있는 피커 */
export type PickerType = 'date' | 'time' | null;

/** 일정 폼 전체에서 열려 있는 피커 (시작/종료 × 날짜/시간 중 하나만) */
export type ActivePicker = 'start-date' | 'start-time' | 'end-date' | 'end-time' | null;

export type PickerField = 'start' | 'end';

export interface CalendarMemoFormValues {
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  notifyBefore?: NotifyBefore;
}
