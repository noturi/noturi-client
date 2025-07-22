import { GoogleButton } from "@/components/GoogleButton";
import { Typography } from "@/components/ui/Typography";
import { YStack } from "tamagui";

export default function LoginScreen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$12"
    >
      <Typography variant="display">Noturi</Typography>
      <GoogleButton />
    </YStack>
  );
}
