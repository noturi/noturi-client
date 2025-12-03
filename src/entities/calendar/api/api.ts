import { KyInstance } from 'ky';
import { ENDPOINTS, api, toSearchParams } from '~/shared/api';

import {
  CalendarMemo,
  CalendarMemoListParamsDto,
  CalendarMemoListResponseDto,
  CalendarMemoMonthlyParamsDto,
  CalendarMemoMonthlyResponseDto,
} from '@/entities/calendar/model/types';

export class CalendarMemoApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async getByMonth(
    params: CalendarMemoMonthlyParamsDto = {},
  ): Promise<CalendarMemoMonthlyResponseDto> {
    return this.api
      .get(ENDPOINTS.CALENDAR_MEMOS, { searchParams: toSearchParams(params) })
      .json<CalendarMemoMonthlyResponseDto>();
  }

  async getList(params: CalendarMemoListParamsDto = {}): Promise<CalendarMemoListResponseDto> {
    return this.api
      .get(ENDPOINTS.CALENDAR_MEMOS, { searchParams: toSearchParams(params) })
      .json<CalendarMemoListResponseDto>();
  }

  async getById(id: string): Promise<CalendarMemo> {
    return this.api.get(`${ENDPOINTS.CALENDAR_MEMOS}/${id}`).json<CalendarMemo>();
  }
}

export const calendarMemoApi = new CalendarMemoApi(api);
