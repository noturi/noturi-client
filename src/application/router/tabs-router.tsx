import { useAuth } from '~/entities/auth';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { HREFS } from '~/shared/config';
import { Loading } from '~/shared/ui';

import { Redirect } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export function TabsRouter() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const { currentTheme } = useUserTheme();

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={HREFS.login()} />;
  }

  // 테마 색상을 hex로 변환
  const primaryColor = rgbToHex(currentTheme.colors.primary);
  const bgColor = rgbToHex(currentTheme.colors.bgPrimary);
  const textMutedColor = rgbToHex(currentTheme.colors.textMuted);

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      backgroundColor={bgColor}
      tintColor={primaryColor}
      iconColor={{
        default: textMutedColor,
        selected: primaryColor,
      }}
      labelStyle={{
        default: { color: textMutedColor },
        selected: { color: primaryColor },
      }}
    >
      <NativeTabs.Trigger name="index">
        <Icon drawable="ic_menu_home" sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>홈</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <Icon drawable="ic_menu_agenda" sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <Label>통계</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Icon
          drawable="ic_menu_preferences"
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
        />
        <Label>설정</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
