import { SafeAreaView } from 'react-native-safe-area-context';

import { TabsRouter } from '../../src/application/router';

export default function TabsLayout() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <TabsRouter />
    </SafeAreaView>
  );
}
