import { StatsPage } from '~/pages/stats';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary" edges={['top']}>
      <StatsPage />
    </SafeAreaView>
  );
}
