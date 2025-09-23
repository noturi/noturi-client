import { YStack } from 'tamagui';
import { MemoFormContent } from '~/features/memo/ui/MemoFormContent';
import { MemoFormHeader } from '~/features/memo/ui/MemoFormHeader';

import { SafeAreaView } from 'react-native';

import { router } from 'expo-router';

export default function TextMemoCreateScreen() {
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
          <MemoFormContent keyboardHeight={0} shouldAutoFocus={true} onSuccess={handleSuccess} />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
