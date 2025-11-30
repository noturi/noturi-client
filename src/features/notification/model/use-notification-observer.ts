import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import Logger from '~/shared/lib/logger';

interface NotificationData {
  type?: string;
  calendarMemoId?: string;
  memoId?: string;
  [key: string]: unknown;
}

/**
 * 알림 수신 및 알림 탭 이벤트를 처리하는 훅
 * 앱의 루트 레벨에서 한 번만 호출되어야 합니다
 */
export function useNotificationObserver() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // 알림 수신 리스너 (앱이 포그라운드일 때)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        Logger.info('알림 수신:', notification.request.content);
      },
    );

    // 알림 탭 리스너 (사용자가 알림을 탭했을 때)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as NotificationData;
        Logger.info('알림 탭:', data);

        // 알림 타입에 따른 네비게이션 처리
        handleNotificationNavigation(data);
      },
    );

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

  // 캘린더 메모 알림인 경우
  if (data.calendarMemoId) {
    // 캘린더 탭으로 이동하거나 상세 화면으로 이동
    router.push('/(tabs)');
    return;
  }

  // 일반 메모 알림인 경우
  if (data.memoId) {
    router.push(`/memo/${data.memoId}`);
    return;
  }

  // 기본: 홈으로 이동
  router.push('/(tabs)');
}

