import { useAuth } from '~/entities/auth';
import { notificationService, useNotificationObserver } from '~/features/notification';

import { ReactNode, useEffect } from 'react';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated, isInitialLoading } = useAuth();

  // 알림 수신 및 탭 이벤트 리스너 설정
  useNotificationObserver();

  // 앱 시작 시 푸시 토큰 갱신 (인증 완료 후 1회)
  useEffect(() => {
    if (!isInitialLoading && isAuthenticated) {
      notificationService.refreshDeviceTokenSilently().catch(() => {});
    }
  }, [isInitialLoading, isAuthenticated]);

  return <>{children}</>;
}
