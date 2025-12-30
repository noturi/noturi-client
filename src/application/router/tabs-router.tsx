import { useUserTheme } from '~/application/providers/theme-provider';
import { useAuth } from '~/entities/auth';
import { HREFS } from '~/shared/config';
import { Loading } from '~/shared/ui';

import { Redirect } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export function TabsRouter() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const { hexColors } = useUserTheme();

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={HREFS.login()} />;
  }

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      backgroundColor={hexColors.bgPrimary}
      iconColor={{
        default: hexColors.textMuted,
        selected: hexColors.primary,
      }}
      labelStyle={{
        default: { color: hexColors.textMuted },
        selected: { color: hexColors.primary },
      }}
      tintColor={hexColors.primary}
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
