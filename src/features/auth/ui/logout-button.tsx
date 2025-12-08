import { XStack } from 'tamagui';
import { useAuth } from '~/application/providers/auth-provider';
import { Typography } from '~/shared/ui';

import { Alert } from 'react-native';

import { LogOut } from '@tamagui/lucide-icons';

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
    <XStack
      alignItems="center"
      borderRadius="$5"
      gap="$3"
      paddingHorizontal="$4"
      paddingVertical="$3"
      pressStyle={{ backgroundColor: '$backgroundSecondary' }}
      onPress={confirmLogout}
    >
      <LogOut color="$textPrimary" size="$3" />
      <Typography color="$textPrimary" flex={1} variant="callout">
        로그아웃
      </Typography>
    </XStack>
  );
}
