import { XStack } from 'tamagui';
import { HREFS } from '~/shared/config';
import { Typography } from '~/shared/ui';

import { Alert } from 'react-native';

import { router } from 'expo-router';

import { LogOut } from '@tamagui/lucide-icons';

import { useLogoutMutation } from '../api/mutation';

export function LogoutButton() {
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.replace(HREFS.login());
    },
  });

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => logoutMutation.mutate(),
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
      onPress={handleLogout}
    >
      <LogOut color="$textPrimary" size="$3" />
      <Typography color="$textPrimary" flex={1} variant="callout">
        로그아웃
      </Typography>
    </XStack>
  );
}
