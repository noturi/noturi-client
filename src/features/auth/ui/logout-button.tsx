import { useAuth } from '~/entities/auth';
import { LogOut } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Alert, Pressable, View } from 'react-native';

export function LogoutButton() {
  const { logout } = useAuth();

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
      <LogOut className="text-text-secondary" size={20} />
      <View className="flex-1">
        <Typography className="text-text-primary" variant="callout">
          로그아웃
        </Typography>
      </View>
    </Pressable>
  );
}
