import { XStack, YStack } from 'tamagui';
import { AppleButton } from '~/shared/ui/apple-button';
import { GoogleButton } from '~/shared/ui/google-button';
import { Typography } from '~/shared/ui/typography';

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
