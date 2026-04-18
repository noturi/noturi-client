import { SettingsPage } from '~/pages/settings';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg-secondary" edges={['top']}>
      <SettingsPage />
    </SafeAreaView>
  );
}
