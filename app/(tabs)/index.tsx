import { HomePage } from '~/pages/home';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary" edges={['top']}>
      <HomePage />
    </SafeAreaView>
  );
}
