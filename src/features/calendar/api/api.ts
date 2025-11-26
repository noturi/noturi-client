import { KyInstance } from 'ky';
import { CalendarMemo, CreateCalendarMemoDto } from '~/entities/calendar-memo/model/types';
import { api } from '~/shared/api';

export class CalendarApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async createCalendarMemo(data: CreateCalendarMemoDto): Promise<CalendarMemo> {
    const response = await this.api.post('calendar-memos', {
      json: data,
    });

    return response.json<CalendarMemo>();
  }

  async deleteCalendarMemo(id: string): Promise<void> {
    await this.api.delete(`calendar-memos/${id}`);
  }
}

export const calendarApi = new CalendarApi(api);
