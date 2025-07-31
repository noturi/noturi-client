import { AuthProvider } from "@/context/auth";
import { config } from "@/tamagui.config";
import { TamaguiProvider } from "@tamagui/core";
import { Check, Edit3 } from "@tamagui/lucide-icons";
import { PortalProvider } from "@tamagui/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, Pressable } from "react-native";
import { XStack } from "tamagui";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      onError: (error) => {
        Alert.alert(
          "오류",
          error?.message || "작업 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      },
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
                options={({ route }: any) => ({
                  title: "메모",
                  headerBackTitle: "",
                  headerBackButtonMenuEnabled: false,
                  headerRight: () => (
                    <XStack paddingRight="$3">
                      <Pressable
                        onPress={() => router.push(`/memo/edit/${route.params?.id}`)}
                        style={{ padding: 8 }}
                      >
                        <Edit3 size={20} color="$textSecondary" />
                      </Pressable>
                    </XStack>
                  ),
                })}
              />
              
              <Stack.Screen
                name="memo/edit/[id]"
                options={{
                  title: "메모 수정",
                  headerBackTitle: "",
                  headerBackButtonMenuEnabled: false,
                }}
              />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
