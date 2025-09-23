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
      gap="$7"
      justifyContent="center"
      padding="$5"
    >
      <Typography variant="largeTitle">Noturi</Typography>
      <XStack gap="$5">
        <GoogleButton />
        <AppleButton />
      </XStack>
    </YStack>
  );
}
