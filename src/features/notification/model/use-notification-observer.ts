import Logger from '~/shared/lib/logger';

import { useEffect, useRef } from 'react';

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

interface NotificationData {
  type?: string;
  calendarMemoId?: string;
  memoId?: string;
  [key: string]: unknown;
}

type Subscription = { remove: () => void };

export function useNotificationObserver() {
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  useEffect(() => {
    // 알림 수신 리스너 (앱이 포그라운드일 때)
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      Logger.info('알림 수신:', notification.request.content);
    });

    // 알림 탭 리스너 (사용자가 알림을 탭했을 때)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationData;
      Logger.info('알림 탭:', data);

      handleNotificationNavigation(data);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
}

/**
 * 알림 데이터에 따른 화면 이동 처리
 */
function handleNotificationNavigation(data: NotificationData) {
  if (!data) return;

  if (data.calendarMemoId) {
    router.push('/(tabs)');
    return;
  }

  if (data.memoId) {
    router.push(`/memo/${data.memoId}`);
    return;
  }

  router.push('/(tabs)');
}
