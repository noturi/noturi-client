import { NativeCalendarService } from '~/shared/lib/calendar';
import Logger from '~/shared/lib/logger';

import type { CreateCalendarMemoDto, UpdateCalendarMemoDto } from '@/entities/calendar/model/types';

export class CalendarMemoService {
  // 네이티브 캘린더에서 이벤트 삭제
  static async removeFromNativeCalendar(nativeEventId: string): Promise<boolean> {
    try {
      return await NativeCalendarService.deleteEvent(nativeEventId);
    } catch (error) {
      Logger.error('CalendarMemoService', '네이티브 캘린더 이벤트 삭제 실패:', error);
      return false;
    }
  }

  // CreateCalendarMemoDto를 네이티브 캘린더 이벤트로 변환
  static async createWithNativeSync(createDto: CreateCalendarMemoDto): Promise<{
    memo: CreateCalendarMemoDto;
    nativeEventId?: string;
  }> {
    try {
      let nativeEventId: string | null = null;

      // 네이티브 캘린더에 이벤트 생성
      nativeEventId = await NativeCalendarService.createEvent({
        title: createDto.title,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        notes: `Noturi 앱에서 생성된 캘린더 메모`,
        alarms: createDto.hasNotification
          ? [
              NativeCalendarService.createAlarm(
                NativeCalendarService.notifyBeforeToMinutes(
                  createDto.notifyBefore || 'FIFTEEN_MINUTES_BEFORE',
                ),
              ),
            ]
          : [],
      });

      return {
        memo: {
          ...createDto,
          ...(nativeEventId && { nativeCalendarEventId: nativeEventId }),
        },
        nativeEventId: nativeEventId || undefined,
      };
    } catch (error) {
      Logger.error('CalendarMemoService', '네이티브 캘린더와 함께 생성 실패:', error);
      return { memo: createDto };
    }
  }

  // UpdateCalendarMemoDto를 네이티브 캘린더와 함께 업데이트
  static async updateWithNativeSync(
    updateDto: UpdateCalendarMemoDto & { nativeCalendarEventId?: string },
  ): Promise<{
    memo: UpdateCalendarMemoDto;
    nativeEventId?: string;
  }> {
    try {
      if (updateDto.nativeCalendarEventId) {
        // 기존 네이티브 이벤트 업데이트
        const success = await NativeCalendarService.updateEvent(updateDto.nativeCalendarEventId, {
          title: updateDto.title,
          startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
          endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
          alarms: updateDto.hasNotification
            ? [
                NativeCalendarService.createAlarm(
                  NativeCalendarService.notifyBeforeToMinutes(
                    updateDto.notifyBefore || 'FIFTEEN_MINUTES_BEFORE',
                  ),
                ),
              ]
            : [],
        });

        if (success) {
          return {
            memo: updateDto,
            nativeEventId: updateDto.nativeCalendarEventId,
          };
        }
      }

      return { memo: updateDto };
    } catch (error) {
      Logger.error('CalendarMemoService', '네이티브 캘린더와 함께 업데이트 실패:', error);
      return { memo: updateDto };
    }
  }

  // 네이티브 캘린더 권한 확인 및 요청
  static async checkAndRequestPermissions(): Promise<boolean> {
    return await NativeCalendarService.requestPermissions();
  }
}
