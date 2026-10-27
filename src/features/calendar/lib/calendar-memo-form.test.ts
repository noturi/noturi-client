import type { CalendarMemo } from '~/entities/calendar';
import { formatDateTimeForApi } from '~/shared/lib/format';

import {
  fromCalendarMemo,
  getAllDayEndDateTime,
  getInitialDateRange,
  isCalendarMemoTitleValid,
  toActivePicker,
  toCalendarMemoDto,
  toFieldPicker,
  withTimeOf,
} from './calendar-memo-form';

describe('calendar-memo-form', () => {
  it('isCalendarMemoTitleValid: 공백만 있으면 false', () => {
    expect(isCalendarMemoTitleValid('')).toBe(false);
    expect(isCalendarMemoTitleValid('   ')).toBe(false);
    expect(isCalendarMemoTitleValid(' 회의 ')).toBe(true);
  });

  it('toCalendarMemoDto: 제목 trim, 초 제거, 알림 여부 계산', () => {
    const start = new Date(2026, 9, 27, 10, 30, 45, 123);
    const end = new Date(2026, 9, 27, 11, 30, 15);

    expect(
      toCalendarMemoDto({
        title: '  회의  ',
        startDateTime: start,
        endDateTime: end,
        isAllDay: false,
        notifyBefore: undefined,
      }),
    ).toEqual({
      title: '회의',
      startDate: formatDateTimeForApi(new Date(2026, 9, 27, 10, 30)),
      endDate: formatDateTimeForApi(new Date(2026, 9, 27, 11, 30)),
      isAllDay: false,
      hasNotification: false,
      notifyBefore: undefined,
    });

    const withNotify = toCalendarMemoDto({
      title: 'a',
      startDateTime: start,
      endDateTime: end,
      isAllDay: true,
      notifyBefore: 'ONE_HOUR_BEFORE',
    });
    expect(withNotify.hasNotification).toBe(true);
    expect(withNotify.notifyBefore).toBe('ONE_HOUR_BEFORE');
  });

  it('fromCalendarMemo: 알림 없으면 notifyBefore 제거', () => {
    const memo: CalendarMemo = {
      id: '1',
      title: '일정',
      startDate: '2026-10-27T01:00:00.000Z',
      endDate: '2026-10-27T02:00:00.000Z',
      isAllDay: true,
      hasNotification: false,
      notifyBefore: 'ONE_HOUR_BEFORE',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    };

    const values = fromCalendarMemo(memo);
    expect(values.title).toBe('일정');
    expect(values.startDateTime.toISOString()).toBe('2026-10-27T01:00:00.000Z');
    expect(values.endDateTime.toISOString()).toBe('2026-10-27T02:00:00.000Z');
    expect(values.isAllDay).toBe(true);
    expect(values.notifyBefore).toBeUndefined();

    expect(fromCalendarMemo({ ...memo, hasNotification: true }).notifyBefore).toBe(
      'ONE_HOUR_BEFORE',
    );
  });

  describe('getInitialDateRange', () => {
    const now = new Date(2026, 9, 27, 14, 25);

    it('단일 날짜: 시작은 (현재 시+1) 정각, 종료는 +1시간', () => {
      const { startDateTime, endDateTime } = getInitialDateRange(
        '2026-11-03T00:00:00',
        undefined,
        now,
      );
      expect(startDateTime).toEqual(new Date(2026, 10, 3, 15, 0, 0, 0));
      expect(endDateTime).toEqual(new Date(2026, 10, 3, 16, 0, 0, 0));
    });

    it('기간 선택: 종료일의 (시작 시+1) 정각', () => {
      const { startDateTime, endDateTime } = getInitialDateRange(
        '2026-11-03T00:00:00',
        '2026-11-05T00:00:00',
        now,
      );
      expect(startDateTime).toEqual(new Date(2026, 10, 3, 15, 0, 0, 0));
      expect(endDateTime).toEqual(new Date(2026, 10, 5, 16, 0, 0, 0));
    });
  });

  it('getAllDayEndDateTime: 시작 + 1시간, 분 유지, 원본 불변', () => {
    const start = new Date(2026, 9, 27, 9, 40);
    expect(getAllDayEndDateTime(start)).toEqual(new Date(2026, 9, 27, 10, 40));
    expect(start).toEqual(new Date(2026, 9, 27, 9, 40));
  });

  it('withTimeOf: 날짜는 date, 시/분은 timeSource', () => {
    const date = new Date(2026, 10, 3, 0, 0);
    const time = new Date(2026, 9, 27, 18, 5);
    expect(withTimeOf(date, time)).toEqual(new Date(2026, 10, 3, 18, 5));
    expect(date).toEqual(new Date(2026, 10, 3, 0, 0));
  });

  it('toFieldPicker / toActivePicker: 필드별 피커 매핑', () => {
    expect(toFieldPicker('start-date', 'start')).toBe('date');
    expect(toFieldPicker('start-time', 'start')).toBe('time');
    expect(toFieldPicker('end-time', 'start')).toBeNull();
    expect(toFieldPicker('end-date', 'end')).toBe('date');
    expect(toFieldPicker(null, 'end')).toBeNull();

    expect(toActivePicker('start', 'date')).toBe('start-date');
    expect(toActivePicker('end', 'time')).toBe('end-time');
    expect(toActivePicker('end', null)).toBeNull();
  });
});
