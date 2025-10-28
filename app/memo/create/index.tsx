import { YStack } from 'tamagui';
import { MemoFormContent } from '~/features/memo/ui/memo-form-content';
import { MemoFormHeader } from '~/features/memo/ui/memo-form-header';

import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  const handleClose = () => {
    router.back();

  };
  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <MemoFormHeader onClose={handleClose} />
        <YStack flex={1}>
          <MemoFormContent shouldAutoFocus={true} onSuccess={handleSuccess} />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
