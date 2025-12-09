import { XStack, YStack } from 'tamagui';
import { AppleButton, GoogleButton } from '~/features/auth/ui';
import { Typography } from '~/shared/ui';

import { Platform } from 'react-native';

export function LoginPage() {
  return (
    <YStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      flex={1}
      gap="$8"
      justifyContent="center"
      padding="$5"
    >
      <Typography variant="largeTitle">Noturi</Typography>

      <XStack gap="$6">
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleButton />}
      </XStack>
    </YStack>
  );
}
