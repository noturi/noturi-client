import { KyInstance } from 'ky';
import {
  CalendarMemo,
  CreateCalendarMemoDto,
  UpdateCalendarMemoDto,
} from '~/entities/calendar/model/types';
import { api } from '~/shared/api';

export class CalendarApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  async getCalendarMemo(id: string): Promise<CalendarMemo> {
    const response = await this.api.get(`calendar-memos/${id}`);
    return response.json<CalendarMemo>();
  }

  async createCalendarMemo(data: CreateCalendarMemoDto): Promise<CalendarMemo> {
    const response = await this.api.post('calendar-memos', {
      json: data,
    });

    return response.json<CalendarMemo>();
  }

  async updateCalendarMemo(
    id: string,
    data: Omit<UpdateCalendarMemoDto, 'id'>,
  ): Promise<CalendarMemo> {
    const response = await this.api.put(`calendar-memos/${id}`, {
      json: data,
    });

    return response.json<CalendarMemo>();
  }

  async deleteCalendarMemo(id: string): Promise<void> {
    await this.api.delete(`calendar-memos/${id}`);
  }
}

export const calendarApi = new CalendarApi(api);
