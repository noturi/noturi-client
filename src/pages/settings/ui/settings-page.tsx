import { Separator, XStack, YStack } from 'tamagui';
import { useAuth } from '~/entities/auth';
import { DeleteAccountButton, LogoutButton } from '~/features/auth/ui';
import { CategoryManageSheet } from '~/features/categories/ui/category-manage-sheet';
import { NotificationToggle } from '~/features/notification';
import { EXTERNAL_LINKS } from '~/shared/config';
import { Card, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Linking } from 'react-native';

import Constants from 'expo-constants';

import { FileText, Info, Settings } from '@tamagui/lucide-icons';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export function SettingsPage() {
  const [openManage, setOpenManage] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePrivacyPolicy = () => {
    Linking.openURL(EXTERNAL_LINKS.PRIVACY_POLICY);
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
              {appVersion}
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
              이용약관 및 개인정보처리방침
            </Typography>
          </XStack>
        </YStack>
      </Card>

      <CategoryManageSheet isOpen={openManage} onClose={() => setOpenManage(false)} />

      {isAuthenticated && <DeleteAccountButton />}
    </YStack>
  );
}
