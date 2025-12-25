import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  const { currentTheme } = useUserTheme();
  const bgColor = rgbToHex(currentTheme.colors.bgSecondary);

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}
    >
      <TabsRouter />
    </SafeAreaView>
  );
}
