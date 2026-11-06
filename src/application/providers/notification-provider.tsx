import { useAuth } from '~/entities/auth';
import { userSettingsQuery } from '~/entities/user';
import { notificationService, useNotificationObserver } from '~/features/notification';

import { ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import { useQuery } from '@tanstack/react-query';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const isReady = !isInitialLoading && isAuthenticated;

  // 계정 알림 설정 — 권한을 아직 묻지 않은 기기에서 물어볼지 판단
  const { data: settings } = useQuery({ ...userSettingsQuery(), enabled: isReady });
  const accountNotificationEnabled = settings?.notification;

  // 알림 수신 및 탭 이벤트 리스너 설정
  useNotificationObserver();

  // 로그인 후·포그라운드 복귀마다 이 기기 등록을 맞춤 (설정 앱에서 권한을 켜고 돌아온 경우 포함)
  useEffect(() => {
    if (!isReady || accountNotificationEnabled === undefined) return;

    const sync = () => {
      notificationService.syncThisDevice({ accountNotificationEnabled }).catch(() => {});
    };

    sync();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });
    return () => subscription.remove();
  }, [isReady, accountNotificationEnabled]);

  return <>{children}</>;
}
