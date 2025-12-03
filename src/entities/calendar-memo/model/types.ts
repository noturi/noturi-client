// 알림 시간 옵션
export type NotifyBefore =
  | 'AT_START_TIME'
  | 'FIVE_MINUTES_BEFORE'
  | 'TEN_MINUTES_BEFORE'
  | 'FIFTEEN_MINUTES_BEFORE'
  | 'THIRTY_MINUTES_BEFORE'
  | 'ONE_HOUR_BEFORE'
  | 'ONE_DAY_BEFORE'
  | 'TWO_DAYS_BEFORE'
  | 'THREE_DAYS_BEFORE'
  | 'ONE_WEEK_BEFORE';

// 캘린더 메모 기본 타입
export interface CalendarMemo {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isAllDay?: boolean; // 하루 종일 일정 여부
  hasNotification: boolean;
  notifyBefore: NotifyBefore;
  nativeCalendarEventId?: string; // 네이티브 캘린더 이벤트 ID
  createdAt: string;
  updatedAt: string;
}

// 캘린더 메모 월별 조회 파라미터 (캘린더 뷰용)
export interface CalendarMemoMonthlyParamsDto {
  keyword?: string;
  year?: number;
  month?: number; // 1-12
  hasNotification?: boolean;
}

// 캘린더 메모 월별 조회 응답 타입
export interface CalendarMemoMonthlyResponseDto {
  year: number;
  month: number;
  data: CalendarMemo[];
  total: number;
}

// 캘린더 메모 목록 요청 파라미터 (목록 뷰용)
export interface CalendarMemoListParamsDto {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  hasNotification?: boolean;
  page?: number;
  limit?: number;
}

// 캘린더 메모 목록 응답 타입
export interface CalendarMemoListResponseDto {
  data: CalendarMemo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 캘린더 메모 생성 요청 타입
export interface CreateCalendarMemoDto {
  title: string;
  startDate: string;
  endDate: string;
  isAllDay?: boolean;
  hasNotification?: boolean;
  notifyBefore?: NotifyBefore;
}

// 캘린더 메모 수정 요청 타입
export interface UpdateCalendarMemoDto {
  id: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  isAllDay?: boolean;
  hasNotification?: boolean;
  notifyBefore?: NotifyBefore;
}
