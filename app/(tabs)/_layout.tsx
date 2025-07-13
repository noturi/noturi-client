import { useAuth } from "@/context/auth";
import { Redirect, Tabs } from "expo-router";
import { Spinner, YStack } from "tamagui";

export default function TabsLayout() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
