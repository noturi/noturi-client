import { useUserTheme } from '~/features/theme';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  const { hexColors } = useUserTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: hexColors.bgSecondary,
      }}
    >
      <TabsRouter />
    </SafeAreaView>
  );
}
