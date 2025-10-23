import { useTheme } from 'tamagui';

import { Redirect } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAuth } from '../../features/auth';
import { HREFS } from '../../shared/constants';
import { Loading } from '../../shared/ui';

export function TabsRouter() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const theme = useTheme();

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={HREFS.login()} />;
  }

  return (
    <NativeTabs disableTransparentOnScrollEdge tintColor={String(theme.primary.val)}>
      <NativeTabs.Trigger name="index">
        <Icon drawable="ic_menu_home" sf="house.fill" />
        <Label>홈</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <Icon drawable="ic_menu_agenda" sf="chart.bar.fill" />
        <Label>통계</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon drawable="ic_menu_myplaces" sf="person.fill" />
        <Label>프로필</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
