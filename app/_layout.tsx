import { AuthProvider } from "@/context/auth";
import { config } from "@/tamagui.config";
import { TamaguiProvider } from "@tamagui/core";
import { Check, Edit3 } from "@tamagui/lucide-icons";
import { PortalProvider } from "@tamagui/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { XStack } from "tamagui";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <PortalProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#ffffff",
                },
                headerTintColor: "#111827",
                headerTitleStyle: {
                  fontWeight: "600",
                  fontSize: 20,
                },
                headerShadowVisible: false,
                headerBackTitle: "",
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              <Stack.Screen
                name="create"
                options={{
                  title: "메모 작성",
                  presentation: "modal",
                  headerRight: () => (
                    <XStack paddingRight="$3">
                      <Pressable
                        onPress={() => console.log("저장")}
                        style={{ padding: 8 }}
                      >
                        <Check size={20} color="$textSecondary" />
                      </Pressable>
                    </XStack>
                  ),
                }}
              />

              <Stack.Screen
                name="settings"
                options={{
                  title: "설정",
                  presentation: "modal",
                }}
              />

              <Stack.Screen
                name="memo/[id]"
                options={{
                  title: "메모",
                  headerRight: () => (
                    <XStack paddingRight="$3">
                      <Pressable
                        onPress={() => console.log("편집")}
                        style={{ padding: 8 }}
                      >
                        <Edit3 size={20} color="$textSecondary" />
                      </Pressable>
                    </XStack>
                  ),
                }}
              />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
