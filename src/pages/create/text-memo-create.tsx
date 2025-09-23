import { YStack } from 'tamagui';
import { MemoFormContent } from '~/features/memo/ui/MemoFormContent';
import { MemoFormHeader } from '~/features/memo/ui/MemoFormHeader';

import { router } from 'expo-router';

export default function TextMemoCreateScreen() {
  const handleClose = () => {
    router.back();
  };

  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <MemoFormHeader onClose={handleClose} />
      <MemoFormContent keyboardHeight={0} shouldAutoFocus={true} onSuccess={handleSuccess} />
    </YStack>
  );
}
