import { KyInstance } from 'ky';
import {
  CalendarMemo,
  CalendarMemoListParamsDto,
  CalendarMemoListResponseDto,
  CalendarMemoMonthlyParamsDto,
  CalendarMemoMonthlyResponseDto,
} from '~/entities/calendar-memo/model/types';
import { api } from '~/shared/api';

export class CalendarMemoApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 캘린더 메모 월별 조회 (캘린더 뷰용)
  async getCalendarMemosMonthly(
    params: CalendarMemoMonthlyParamsDto = {},
  ): Promise<CalendarMemoMonthlyResponseDto> {
    const searchParams = new URLSearchParams();

    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.month) searchParams.append('month', params.month.toString());
    if (params.hasNotification !== undefined)
      searchParams.append('hasNotification', params.hasNotification.toString());

    const url = `calendar-memos?${searchParams.toString()}`;

    const response = await this.api.get(url);
    const data = await response.json<CalendarMemoMonthlyResponseDto>();

    return data;
  }

  // 캘린더 메모 목록 조회 (목록 뷰용)
  async getCalendarMemos(
    params: CalendarMemoListParamsDto = {},
  ): Promise<CalendarMemoListResponseDto> {
    const searchParams = new URLSearchParams();

    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.hasNotification !== undefined)
      searchParams.append('hasNotification', params.hasNotification.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const url = `calendar-memos?${searchParams.toString()}`;

    const response = await this.api.get(url);
    const data = await response.json<CalendarMemoListResponseDto>();

    return data;
  }

  // 특정 캘린더 메모 조회
  async getCalendarMemo(id: string): Promise<CalendarMemo> {
    const response = await this.api.get(`calendar-memos/${id}`);
    return response.json<CalendarMemo>();
  }
}

export const calendarMemoApi = new CalendarMemoApi(api);
