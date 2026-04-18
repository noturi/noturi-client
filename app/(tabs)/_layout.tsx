import { ApiErrorBoundary } from '~/shared/ui';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-secondary" style={{ paddingTop: insets.top }}>
      <ApiErrorBoundary>
        <TabsRouter />
      </ApiErrorBoundary>
    </View>
  );
}
