import { useTheme } from 'tamagui';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: theme.backgroundSecondary.val,
      }}
    >
      <TabsRouter />
    </SafeAreaView>
  );
}
