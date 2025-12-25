import { Alert, Pressable, View } from 'react-native';

import { LogOut } from 'lucide-react-native';

import { useAuth } from '~/entities/auth';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

export function LogoutButton() {
  const { logout } = useAuth();
  const { currentTheme } = useUserTheme();
  const iconColor = rgbToHex(currentTheme.colors.textSecondary);

  const confirmLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-5 px-4 py-3 active:bg-bg-secondary"
      onPress={confirmLogout}
    >
      <LogOut color={iconColor} size={20} />
      <View className="flex-1">
        <Typography className="text-text-primary" variant="callout">
          로그아웃
        </Typography>
      </View>
    </Pressable>
  );
}
