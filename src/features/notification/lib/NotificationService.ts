import * as Notifications from 'expo-notifications';
import { CreateNotificationMemoDto, NotificationMemo } from '~/entities/memo/model/types';

export class NotificationService {
  static async createNotificationMemo(data: CreateNotificationMemoDto): Promise<NotificationMemo> {
    const notificationId = await this.scheduleNotification({
      title: data.title,
      body: data.content,
      trigger: data.reminderDate,
    });

    const notificationMemo: NotificationMemo = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      content: data.content,
      reminderDate: data.reminderDate,
      notificationId,
      categoryId: data.categoryId,
      userId: 'temp-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNotified: false,
    };

    return notificationMemo;
  }

  static async scheduleNotification({
    title,
    body,
    trigger,
  }: {
    title: string;
    body: string;
    trigger: Date;
  }): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔔 ${title}`,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    console.log(`알림이 예약되었습니다: ${notificationId}`);
    return notificationId;
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`알림이 취소되었습니다: ${notificationId}`);
    } catch (error) {
      console.error('알림 취소 실패:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('모든 예약된 알림이 취소되었습니다');
    } catch (error) {
      console.error('모든 알림 취소 실패:', error);
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('예약된 알림 조회 실패:', error);
      return [];
    }
  }
}