import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotifications = () => {
  const scheduledNotificationRef = useRef<string | null>(null);

  useEffect(() => {
    const configureNotificationsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        return console.warn('⚠️ Notification Permissions not granted!');
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldShowAlert: true,
          shouldSetBadge: false,
        }),
      });
    };
    configureNotificationsAsync();
  }, []);

  const scheduleNotificationAsync = async (
    request: Notifications.NotificationRequestInput
  ) => {
    const notification = await Notifications.scheduleNotificationAsync(request);
    scheduledNotificationRef.current = notification;
    console.log('✍️ Scheduling notification: ', notification);
  };

  const cancelNotificationAsync = async () => {
    if (scheduledNotificationRef.current) {
      console.log('🗑️ Canceling notification: ', scheduledNotificationRef.current);
      await Notifications.cancelScheduledNotificationAsync(
        scheduledNotificationRef.current
      );
      scheduledNotificationRef.current = null;
    }
  };

  return { scheduleNotificationAsync, cancelNotificationAsync };
};