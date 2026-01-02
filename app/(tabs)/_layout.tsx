import { ApiErrorBoundary } from '~/shared/ui';

import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary" edges={['top']}>
      <ApiErrorBoundary>
        <TabsRouter />
      </ApiErrorBoundary>
    </SafeAreaView>
  );
}
