import { XStack, YStack } from 'tamagui';
import { AppleButton, GoogleButton } from '~/features/auth/ui';
import { Typography } from '~/shared/ui/typography';

import { Platform } from 'react-native';

export default function LoginScreen() {
  return (
    <YStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      flex={1}
      gap="$7"
      justifyContent="center"
      padding="$5"
    >
      <Typography variant="largeTitle">Noturi</Typography>
      <XStack gap="$5">
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleButton />}
      </XStack>
    </YStack>
  );
}
