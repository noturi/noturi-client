import { Separator, XStack, YStack } from 'tamagui';
import { useAuth } from '~/application/providers/auth-provider';
import { LogoutButton } from '~/features/auth/ui';
import { CategoryManageSheet } from '~/features/categories/ui/category-manage-sheet';
import { NotificationToggle } from '~/features/notification';
import { Card, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Linking } from 'react-native';

import { FileText, Info, Settings } from '@tamagui/lucide-icons';

export default function SettingsScreen() {
  const [openManage, setOpenManage] = useState(false);
  const { isAuthenticated } = useAuth();

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
            <NotificationToggle />
            <Separator borderColor="$border" />
            <LogoutButton />
          </YStack>
        </Card>
      )}

      <Card>
        <YStack gap="$2">
          <XStack
            alignItems="center"
            borderRadius="$5"
            gap="$3"
            paddingHorizontal="$4"
            paddingVertical="$3"
          >
            <Info color="$textSecondary" size="$3" />
            <Typography color="$textPrimary" flex={1} variant="callout">
              버전
            </Typography>
            <Typography color="$textMuted" variant="callout">
              1.0.0
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
