import { useNotificationObserver } from '~/features/notification';

import { ReactNode } from 'react';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  // 알림 수신 및 탭 이벤트 리스너 설정
  useNotificationObserver();

  return <>{children}</>;
}
