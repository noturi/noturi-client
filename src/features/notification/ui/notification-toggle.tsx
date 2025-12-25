import { Bell } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Switch, Typography } from '~/shared/ui';

import { useEffect, useState } from 'react';
import { Alert, Linking, View } from 'react-native';

import { notificationService } from '../model';

const openSettings = () => Linking.openSettings();

const showAlert = (title: string, message: string) => Alert.alert(title, message);

const showSettingsAlert = () => {
  Alert.alert('알림 권한 필요', '설정 앱에서 알림을 허용해주세요.', [
    { text: '취소', style: 'cancel' },
    { text: '설정으로 이동', onPress: openSettings },
  ]);
};

export function NotificationToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentTheme } = useUserTheme();

  const textSecondary = rgbToHex(currentTheme.colors.textSecondary);

  useEffect(() => {
    notificationService.isNotificationEnabled().then(setEnabled);
  }, []);

  const enableNotification = async () => {
    const success = await notificationService.registerDevice();
    if (!success) return showSettingsAlert();

    setEnabled(true);
    showAlert('알림 활성화', '알림이 활성화되었습니다.');
  };

  const disableNotification = async () => {
    await notificationService.unregisterAllDevices();
    setEnabled(false);
    showAlert('알림 비활성화', '알림이 비활성화되었습니다.');
  };

  const handleToggle = async (value: boolean) => {
    if (loading) return;
    setLoading(true);

    try {
      await (value ? enableNotification() : disableNotification());
    } catch (error: any) {
      showAlert('오류', `알림 설정 중 문제가 발생했습니다.\n${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-row items-center gap-3 rounded-5 px-4 py-3">
      <Bell color={textSecondary} size={20} />
      <View className="flex-1">
        <Typography className="text-text-primary" variant="callout">
          알림
        </Typography>
      </View>
      <Switch checked={enabled} disabled={loading} onCheckedChange={handleToggle} />
    </View>
  );
}
