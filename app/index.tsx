import { useAuth } from "@/context/auth";
import { Redirect } from "expo-router";
import { Spinner, YStack } from "tamagui";

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
