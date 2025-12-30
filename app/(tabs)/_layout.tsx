import { useUserTheme } from '~/application/providers/theme-provider';
import { ApiErrorBoundary } from '~/shared/ui';

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
      <ApiErrorBoundary>
        <TabsRouter />
      </ApiErrorBoundary>
    </SafeAreaView>
  );
}
