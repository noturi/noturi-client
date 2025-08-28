import { XStack, YStack } from 'tamagui';
import { AppleButton } from '~/shared/ui/AppleButton';
import { GoogleButton } from '~/shared/ui/GoogleButton';
import { Typography } from '~/shared/ui/Typography';

export default function LoginScreen() {
  return (
    <YStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      flex={1}
      gap="$3xl"
      justifyContent="center"
      padding="$xl"
    >
      <Typography variant="display">Noturi</Typography>
      <XStack gap="$xl">
        <GoogleButton />
        <AppleButton />
      </XStack>
    </YStack>
  );
}
