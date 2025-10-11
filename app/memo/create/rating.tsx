import { YStack } from 'tamagui';
import { MemoFormContent } from '~/features/memo/ui/memo-form-content';

import { SafeAreaView } from 'react-native';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <YStack flex={1}>
          <MemoFormContent shouldAutoFocus={true} onSuccess={handleSuccess} />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
