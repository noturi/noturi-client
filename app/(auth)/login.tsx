import { YStack } from 'tamagui';

import { GoogleButton } from '@/components/ui/GoogleButton';
import { Typography } from '@/components/ui/Typography';

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
      <GoogleButton />
    </YStack>
  );
}
