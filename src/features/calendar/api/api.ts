import { KyInstance } from 'ky';
import { CalendarMemo, CreateCalendarMemoDto } from '~/entities/calendar-memo/model/types';
import { api } from '~/shared/api';

export class CalendarApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 캘린더 메모 생성
  async createCalendarMemo(data: CreateCalendarMemoDto): Promise<CalendarMemo> {
    const response = await this.api.post('calendar-memos', {
      json: data,
    });

    return response.json<CalendarMemo>();
  }
}

export const calendarApi = new CalendarApi(api);
