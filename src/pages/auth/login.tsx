import { XStack, YStack } from 'tamagui';
import { AppleButton } from '~/shared/ui/AppleButton';
import { GoogleButton } from '~/shared/ui/GoogleButton';
import { Typography } from '~/shared/ui/Typography';

export default function LoginScreen() {
  return (
    <YStack
      alignItems="center"
      backgroundColor="$background"
      flex={1}
      gap="$12"
      justifyContent="center"
      padding="$6"
    >
      <Typography variant="display">Noturi</Typography>
      <XStack gap="$4">
        <GoogleButton />
        <AppleButton />
      </XStack>
    </YStack>
  );
}
