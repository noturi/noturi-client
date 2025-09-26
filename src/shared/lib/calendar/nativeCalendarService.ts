import { Platform } from 'react-native';

import * as Calendar from 'expo-calendar';

import Logger from '../logger';

export interface NativeCalendarEvent {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
  alarms?: Calendar.Alarm[];
  recurrenceRule?: Calendar.RecurrenceRule;
}

export class NativeCalendarService {
  private static defaultCalendarId: string | null = null;

  // 캘린더 권한 요청
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      Logger.info('NativeCalendarService', `캘린더 권한 상태: ${status}`);
      return status === 'granted';
    } catch (error) {
      Logger.error('NativeCalendarService', '캘린더 권한 요청 실패:', error);
      return false;
    }
  }

  // 기본 캘린더 가져오기 또는 생성
  static async getOrCreateDefaultCalendar(): Promise<string | null> {
    try {
      if (this.defaultCalendarId) {
        return this.defaultCalendarId;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        Logger.warn('NativeCalendarService', '캘린더 권한이 없습니다');
        return null;
      }

      // 기존 캘린더 찾기
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const existingCalendar = calendars.find((cal) => cal.title === 'Noturi 메모');

      if (existingCalendar) {
        this.defaultCalendarId = existingCalendar.id;
        return existingCalendar.id;
      }

      // 새 캘린더 생성
      const defaultCalendarSource = Platform.select({
        ios: calendars.find((cal) => cal.source.name === 'Default')?.source,
        android: calendars.find((cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER)
          ?.source,
      });

      if (!defaultCalendarSource) {
        Logger.error('NativeCalendarService', '기본 캘린더 소스를 찾을 수 없습니다');
        return null;
      }

      const calendarId = await Calendar.createCalendarAsync({
        title: 'Noturi 메모',
        color: '#007AFF',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'noturi-memo-calendar',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      this.defaultCalendarId = calendarId;
      Logger.info('NativeCalendarService', `새 캘린더 생성됨: ${calendarId}`);
      return calendarId;
    } catch (error) {
      Logger.error('NativeCalendarService', '기본 캘린더 가져오기/생성 실패:', error);
      return null;
    }
  }

  // 네이티브 캘린더에 이벤트 생성
  static async createEvent(event: NativeCalendarEvent): Promise<string | null> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) {
        Logger.warn('NativeCalendarService', '캘린더를 사용할 수 없습니다');
        return null;
      }

      const eventId = await Calendar.createEventAsync(calendarId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        location: event.location,
        alarms: event.alarms || [],
        recurrenceRule: event.recurrenceRule,
      });

      Logger.info('NativeCalendarService', `네이티브 캘린더 이벤트 생성: ${eventId}`);
      return eventId;
    } catch (error) {
      Logger.error('NativeCalendarService', '네이티브 캘린더 이벤트 생성 실패:', error);
      return null;
    }
  }

  // 네이티브 캘린더 이벤트 수정
  static async updateEvent(eventId: string, event: Partial<NativeCalendarEvent>): Promise<boolean> {
    try {
      await Calendar.updateEventAsync(eventId, {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        notes: event.notes,
        location: event.location,
        alarms: event.alarms,
        recurrenceRule: event.recurrenceRule,
      });

      Logger.info('NativeCalendarService', `네이티브 캘린더 이벤트 수정: ${eventId}`);
      return true;
    } catch (error) {
      Logger.error('NativeCalendarService', '네이티브 캘린더 이벤트 수정 실패:', error);
      return false;
    }
  }

  // 네이티브 캘린더 이벤트 삭제
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await Calendar.deleteEventAsync(eventId);
      Logger.info('NativeCalendarService', `네이티브 캘린더 이벤트 삭제: ${eventId}`);
      return true;
    } catch (error) {
      Logger.error('NativeCalendarService', '네이티브 캘린더 이벤트 삭제 실패:', error);
      return false;
    }
  }

  // 네이티브 캘린더에서 이벤트 조회
  static async getEvents(startDate: Date, endDate: Date): Promise<Calendar.Event[]> {
    try {
      const calendarId = await this.getOrCreateDefaultCalendar();
      if (!calendarId) {
        return [];
      }

      const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);
      Logger.info('NativeCalendarService', `네이티브 캘린더 이벤트 조회: ${events.length}개`);
      return events;
    } catch (error) {
      Logger.error('NativeCalendarService', '네이티브 캘린더 이벤트 조회 실패:', error);
      return [];
    }
  }

  // 알림 시간을 Expo Calendar Alarm으로 변환
  static createAlarm(minutesBefore: number): Calendar.Alarm {
    return {
      relativeOffset: -minutesBefore,
      method: Calendar.AlarmMethod.ALERT,
    };
  }

  // NotifyBefore 타입을 분으로 변환
  static notifyBeforeToMinutes(notifyBefore: string): number {
    switch (notifyBefore) {
      case 'FIVE_MINUTES_BEFORE':
        return 5;
      case 'FIFTEEN_MINUTES_BEFORE':
        return 15;
      case 'THIRTY_MINUTES_BEFORE':
        return 30;
      case 'ONE_HOUR_BEFORE':
        return 60;
      case 'ONE_DAY_BEFORE':
        return 24 * 60;
      default:
        return 15; // 기본값: 15분 전
    }
  }
}
