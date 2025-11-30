// import * as Calendar from 'expo-calendar';
import Logger from '../logger';

// 임시 타입 정의 (expo-calendar 없을 때 사용)
namespace Calendar {
  export interface Alarm {
    relativeOffset: number;
    method: AlarmMethod;
  }

  export enum AlarmMethod {
    ALERT = 'alert',
  }

  export interface RecurrenceRule {
    frequency: string;
    interval?: number;
    endDate?: Date;
    occurrence?: number;
  }

  export interface Event {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    location?: string;
  }

  export enum EntityTypes {
    EVENT = 'event',
  }

  export enum CalendarAccessLevel {
    OWNER = 'owner',
  }
}

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
      // 임시로 권한 요청 비활성화 (에러 방지용)
      Logger.info(
        'NativeCalendarService',
        '네이티브 캘린더 기능 임시 비활성화 - 나중에 활성화 예정',
      );
      return false;

      /* 나중에 활성화할 때 주석 해제 - expo-calendar import도 함께 활성화 필요
        // 먼저 권한 상태 확인
        const { status: currentStatus } = await Calendar.getCalendarPermissionsAsync();
        
        if (currentStatus === 'granted') {
          Logger.info('NativeCalendarService', '캘린더 권한이 이미 허용됨');
          return true;
        }
        
        // 권한 요청
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        Logger.info('NativeCalendarService', `캘린더 권한 요청 결과: ${status}`);
        return status === 'granted';
        */
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

      // 권한이 있는지 다시 한번 확인
      // const { status } = await Calendar.getCalendarPermissionsAsync();
      // if (status !== 'granted') {
      //   Logger.warn('NativeCalendarService', '캘린더 권한이 허용되지 않음');
      //   return null;
      // }

      // 기존 캘린더 찾기
      // const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      // const existingCalendar = calendars.find((cal) => cal.title === 'Noturi 메모');

      // if (existingCalendar) {
      //   this.defaultCalendarId = existingCalendar.id;
      //   return existingCalendar.id;
      // }

      // 새 캘린더 생성
      // const defaultCalendarSource = Platform.select({
      //   ios: calendars.find((cal) => cal.source.name === 'Default')?.source,
      //   android: calendars.find((cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER)
      //     ?.source,
      // });

      // if (!defaultCalendarSource) {
      //   Logger.error('NativeCalendarService', '기본 캘린더 소스를 찾을 수 없습니다');
      //   return null;
      // }

      // const calendarId = await Calendar.createCalendarAsync({
      //   title: 'Noturi 메모',
      //   color: '#007AFF',
      //   entityType: Calendar.EntityTypes.EVENT,
      //   sourceId: defaultCalendarSource.id,
      //   source: defaultCalendarSource,
      //   name: 'noturi-memo-calendar',
      //   ownerAccount: 'personal',
      //   accessLevel: Calendar.CalendarAccessLevel.OWNER,
      // });

      // this.defaultCalendarId = calendarId;
      // Logger.info('NativeCalendarService', `새 캘린더 생성됨: ${calendarId}`);
      // return calendarId;

      // 임시로 null 반환
      Logger.info('NativeCalendarService', '네이티브 캘린더 기능 비활성화됨');
      return null;
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

      // const eventId = await Calendar.createEventAsync(calendarId, {
      //   title: event.title,
      //   startDate: event.startDate,
      //   endDate: event.endDate,
      //   notes: event.notes,
      //   location: event.location,
      //   alarms: event.alarms || [],
      //   recurrenceRule: event.recurrenceRule,
      // });
      const eventId = null;

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
      // await Calendar.updateEventAsync(eventId, {
      //   title: event.title,
      //   startDate: event.startDate,
      //   endDate: event.endDate,
      //   notes: event.notes,
      //   location: event.location,
      //   alarms: event.alarms,
      //   recurrenceRule: event.recurrenceRule,
      // });

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
      // await Calendar.deleteEventAsync(eventId);
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

      // const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);
      const events: Calendar.Event[] = [];
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
      case 'AT_START_TIME':
        return 0;
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
