import { YStack } from 'tamagui';
import { MemoFormContent } from '~/features/memo/ui/memo-form-content';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  const handleSuccess = () => {
    router.push('/(tabs)');
  };

  return (
    <YStack backgroundColor="$backgroundSecondary" flex={1}>
      <YStack flex={1} padding="$4">
        <MemoFormContent shouldAutoFocus={true} onSuccess={handleSuccess} />
      </YStack>
    </YStack>
  );
}
