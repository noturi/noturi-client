import { Separator, XStack, YStack } from 'tamagui';
import { useLogoutMutation } from '~/features/auth/api/mutation';
import { useAuth } from '~/features/auth/lib/auth';
import { CategoryManageSheet } from '~/features/categories/ui/CategoryManageSheet';
import { HREFS } from '~/shared/constants/routes';
import { Card, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Alert } from 'react-native';

import { router } from 'expo-router';

import { LogOut, Settings } from '@tamagui/lucide-icons';

export default function ProfileScreen() {
  const [openManage, setOpenManage] = useState(false);
  const { isAuthenticated } = useAuth();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.replace(HREFS.login());
    },
  });

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          logoutMutation.mutate();
        },
      },
    ]);
  };

  return (
    <YStack backgroundColor="$backgroundSecondary" flex={1} gap="$4" padding="$4">
      {isAuthenticated && (
        <Card>
          <YStack gap="$2">
            <XStack
              alignItems="center"
              borderRadius="$5"
              gap="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
              pressStyle={{ backgroundColor: '$backgroundSecondary' }}
              onPress={() => setOpenManage(true)}
            >
              <Settings color="$textSecondary" size="$3" />
              <Typography color="$textPrimary" flex={1} variant="body2">
                카테고리 관리
              </Typography>
            </XStack>

            <Separator borderColor="$border" />

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
              <Typography color="$textPrimary" flex={1} variant="body2">
                로그아웃
              </Typography>
            </XStack>
          </YStack>
        </Card>
      )}

      <Card>
        <YStack gap="$3" padding="$4">
          <Typography color="$textPrimary" variant="subheading">
            앱 정보
          </Typography>
          <YStack gap="$2">
            <Typography color="$textSecondary" variant="body2">
              버전 1.0.0
            </Typography>
            <Typography color="$textSecondary" variant="body2">
              Noturi Team
            </Typography>
          </YStack>
        </YStack>
      </Card>

      <CategoryManageSheet isOpen={openManage} onClose={() => setOpenManage(false)} />
    </YStack>
  );
}
