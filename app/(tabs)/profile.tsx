import { Separator, Switch, XStack, YStack } from 'tamagui';
import { useLogoutMutation } from '~/features/auth/api/mutation';
import { useAuth } from '~/features/auth/model';
import { notificationService } from '~/features/notification';
import { CategoryManageSheet } from '~/features/categories/ui/category-manage-sheet';
import { Card, Typography } from '~/shared/ui';

import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

import { router } from 'expo-router';

import { Bell, FileText, LogOut, Settings } from '@tamagui/lucide-icons';

import { HREFS } from '@/shared/config/routes';

export default function ProfileScreen() {
  const [openManage, setOpenManage] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.replace(HREFS.login());
    },
  });

  // 알림 활성화 상태 확인 (권한 + 토큰 등록 여부)
  const checkNotificationStatus = useCallback(async () => {
    const isEnabled = await notificationService.isNotificationEnabled();
    setNotificationEnabled(isEnabled);
  }, []);

  // 앱 시작 시 알림 상태 확인
  useEffect(() => {
    checkNotificationStatus();
  }, [checkNotificationStatus]);

  // 알림 토글 핸들러
  const handleNotificationToggle = async (enabled: boolean) => {
    if (notificationLoading) return;

    setNotificationLoading(true);

    try {
      if (enabled) {
        // 알림 활성화 시도
        const success = await notificationService.registerDevice();

        if (!success) {
          // 권한이 거부된 경우 설정 앱으로 이동 안내
          Alert.alert(
            '알림 권한 필요',
            '설정 앱에서 알림을 허용해주세요.',
            [
              { text: '취소', style: 'cancel' },
              { text: '설정으로 이동', onPress: () => Linking.openSettings() },
            ],
          );
        } else {
          setNotificationEnabled(true);
        }
      } else {
        // 알림 비활성화 - 서버에서 디바이스 삭제
        await notificationService.unregisterAllDevices();
        setNotificationEnabled(false);
      }
    } finally {
      setNotificationLoading(false);
    }
  };

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

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.notion.so/noturi/Noturi-26835607f32980199ec9d064c0cb4627');
  };

  return (
    <YStack
      backgroundColor="$backgroundSecondary"
      flex={1}
      gap="$4"
      paddingHorizontal="$4"
      paddingTop="$4"
    >
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
              <Typography color="$textPrimary" flex={1} variant="callout">
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
            >
              <Bell color="$textSecondary" size="$3" />
              <Typography color="$textPrimary" flex={1} variant="callout">
                푸시 알림
              </Typography>
              <Switch
                backgroundColor={notificationEnabled ? '$primary' : '$border'}
                checked={notificationEnabled}
                disabled={notificationLoading}
                size="$3"
                onCheckedChange={handleNotificationToggle}
              >
                <Switch.Thumb
                  animation="quick"
                  backgroundColor="white"
                />
              </Switch>
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
              <Typography color="$textPrimary" flex={1} variant="callout">
                로그아웃
              </Typography>
            </XStack>
          </YStack>
        </Card>
      )}

      <Card>
        <YStack gap="$3" padding="$4">
          <Typography color="$textPrimary" variant="title3">
            앱 정보
          </Typography>
          <YStack gap="$2">
            <Typography color="$textSecondary" variant="callout">
              버전 1.0.0
            </Typography>
            <Typography color="$textSecondary" variant="callout">
              Noturi Team
            </Typography>
          </YStack>

          <Separator borderColor="$border" marginVertical="$2" />

          <XStack
            alignItems="center"
            borderRadius="$5"
            gap="$3"
            paddingHorizontal="$2"
            paddingVertical="$3"
            pressStyle={{ backgroundColor: '$backgroundSecondary' }}
            onPress={handlePrivacyPolicy}
          >
            <FileText color="$textSecondary" size="$3" />
            <Typography color="$textPrimary" flex={1} variant="callout">
              개인정보처리방침
            </Typography>
          </XStack>
        </YStack>
      </Card>

      <CategoryManageSheet isOpen={openManage} onClose={() => setOpenManage(false)} />
    </YStack>
  );
}
