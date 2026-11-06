import { Bell } from '~/shared/lib/icons';
import Logger from '~/shared/lib/logger';
import { Switch, Typography } from '~/shared/ui';

import { useEffect, useState } from 'react';
import { Alert, AppState, Linking, Pressable, View } from 'react-native';

import { notificationService } from '../model';

const openSettings = () => Linking.openSettings();

const showAlert = (title: string, message: string) => Alert.alert(title, message);

const showSettingsAlert = () => {
  Alert.alert('알림 권한 필요', '설정 앱에서 알림을 허용해주세요.', [
    { text: '취소', style: 'cancel' },
    { text: '설정으로 이동', onPress: openSettings },
  ]);
};

type NotificationToggleProps = {
  /** 계정 알림 설정 — 같은 계정의 모든 기기에 똑같이 적용 */
  enabled: boolean;
  /** 계정 알림 설정 저장 (pages에서 설정 mutation 주입) */
  onEnabledChange: (enabled: boolean) => Promise<unknown>;
};

export function NotificationToggle({ enabled, onEnabledChange }: NotificationToggleProps) {
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // 설정 앱에서 권한을 바꾸고 돌아올 수 있으므로 포그라운드 복귀 때마다 다시 확인
  useEffect(() => {
    const checkPermission = () => {
      notificationService
        .getPermissionStatus()
        .then((status) => setPermissionDenied(status === 'denied'))
        .catch(() => {});
    };

    checkPermission();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkPermission();
    });
    return () => subscription.remove();
  }, []);

  const handleToggle = async (value: boolean) => {
    if (loading) return;
    setLoading(true);

    try {
      // 켤 때는 이 기기 권한부터 — 권한이 없으면 계정 설정도 켜지 않는다
      if (value && !(await notificationService.requestPermissions())) {
        return showSettingsAlert();
      }

      await onEnabledChange(value);

      // 계정 설정을 켠 뒤 등록 (옛 서버는 알림이 꺼진 계정의 등록을 건너뜀)
      if (value) {
        setPermissionDenied(false);
        await notificationService.registerThisDevice();
      }

      showAlert(
        value ? '알림 활성화' : '알림 비활성화',
        value ? '이 계정의 모든 기기에서 알림을 받아요.' : '이 계정의 모든 기기에서 알림이 꺼져요.',
      );
    } catch (error) {
      // 설정 저장 실패 안내는 전역 mutation onError가 띄움
      Logger.warn('알림 설정 변경 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className="flex-row items-center gap-3 rounded-5 px-4 py-3">
        <Bell className="text-text-secondary" size={20} />
        <View className="flex-1">
          <Typography className="text-text-primary" variant="callout">
            알림
          </Typography>
        </View>
        <Switch checked={enabled} disabled={loading} onCheckedChange={handleToggle} />
      </View>

      {/* 계정 알림은 켜져 있는데 이 기기만 OS 권한이 꺼진 경우 */}
      {enabled && permissionDenied && (
        <Pressable className="px-4 pb-3" onPress={openSettings}>
          <Typography className="text-text-muted" variant="footnote">
            이 기기는 알림 권한이 꺼져 있어 받을 수 없어요. 눌러서 설정에서 허용해 주세요.
          </Typography>
        </Pressable>
      )}
    </View>
  );
}
