import { Button, Separator, YStack } from 'tamagui';
import { useLogoutMutation } from '~/features/auth/api/mutation';
import { useAuth } from '~/features/auth/lib/auth';
import { CategoryManageSheet } from '~/features/categories/ui/CategoryManageSheet';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Alert } from 'react-native';

import { router } from 'expo-router';

export default function ProfileScreen() {
  const [openManage, setOpenManage] = useState(false);
  const { isAuthenticated } = useAuth();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      // 로그인 화면으로 이동
      router.replace('/(auth)/login');
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
    <YStack backgroundColor="$backgroundPrimary" flex={1} padding="$4">
      <YStack gap="$4">
        {/* 앱 정보 영역 */}
        <YStack gap="$3">
          <Typography color="$textPrimary" variant="subtitle">
            앱 정보
          </Typography>
          <YStack gap="$2">
            <Typography color="$textSecondary" variant="body1">
              버전: 1.0.0
            </Typography>
            <Typography color="$textSecondary" variant="body1">
              개발자: Noturi Team
            </Typography>
          </YStack>
        </YStack>

        <Separator borderColor="$border" />
        <YStack gap="$3">
          {isAuthenticated && (
            <Button unstyled onPress={() => setOpenManage(true)}>
              <Typography color="$textPrimary" pointerEvents="none" variant="subtitle">
                카테고리 관리
              </Typography>
            </Button>
          )}
        </YStack>

        <Separator borderColor="$border" />
        <YStack gap="$3">
          {isAuthenticated && (
            <Button unstyled onPress={handleLogout}>
              <Typography color="$textPrimary" pointerEvents="none" variant="subtitle">
                로그아웃
              </Typography>
            </Button>
          )}
        </YStack>
      </YStack>
      <CategoryManageSheet isOpen={openManage} onClose={() => setOpenManage(false)} />
    </YStack>
  );
}
