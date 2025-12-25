import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import Constants from 'expo-constants';
import { FileText, Info, Settings } from 'lucide-react-native';

import { useAuth } from '~/entities/auth';
import { DeleteAccountButton, LogoutButton } from '~/features/auth/ui';
import { CategoryManageSheet } from '~/features/categories/ui/category-manage-sheet';
import { NotificationToggle } from '~/features/notification';
import { ThemeSettings, useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { EXTERNAL_LINKS } from '~/shared/config';
import { Card, Typography } from '~/shared/ui';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export function SettingsPage() {
  const [openManage, setOpenManage] = useState(false);
  const { isAuthenticated } = useAuth();
  const { currentTheme } = useUserTheme();
  const iconColor = rgbToHex(currentTheme.colors.textSecondary);

  const handlePrivacyPolicy = () => {
    Linking.openURL(EXTERNAL_LINKS.PRIVACY_POLICY);
  };

  return (
    <View className="flex-1 gap-4 bg-bg-secondary px-4 pt-4">
      <ThemeSettings />

      {isAuthenticated && (
        <Card>
          <View className="gap-2">
            <Pressable
              className="flex-row items-center gap-3 rounded-5 px-4 py-3 active:bg-bg-secondary"
              onPress={() => setOpenManage(true)}
            >
              <Settings color={iconColor} size={20} />
              <Typography className="flex-1 text-text-primary" variant="callout">
                카테고리 관리
              </Typography>
            </Pressable>

            <View className="h-px bg-border" />
            <NotificationToggle />
            <View className="h-px bg-border" />
            <LogoutButton />
          </View>
        </Card>
      )}

      <Card>
        <View className="gap-2">
          <View className="flex-row items-center gap-3 rounded-5 px-4 py-3">
            <Info color={iconColor} size={20} />
            <Typography className="flex-1 text-text-primary" variant="callout">
              버전
            </Typography>
            <Typography className="text-text-muted" variant="callout">
              {appVersion}
            </Typography>
          </View>

          <View className="h-px bg-border" />

          <Pressable
            className="flex-row items-center gap-3 rounded-5 px-4 py-3 active:bg-bg-secondary"
            onPress={handlePrivacyPolicy}
          >
            <FileText color={iconColor} size={20} />
            <Typography className="flex-1 text-text-primary" variant="callout">
              이용약관 및 개인정보처리방침
            </Typography>
          </Pressable>
        </View>
      </Card>

      <CategoryManageSheet isOpen={openManage} onClose={() => setOpenManage(false)} />

      {isAuthenticated && <DeleteAccountButton />}
    </View>
  );
}
