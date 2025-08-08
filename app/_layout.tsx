import { ROUTES, HREFS } from "@/constants";
import { AuthProvider } from "@/context/auth";
import { config } from "@/tamagui.config";
import { TamaguiProvider } from "@tamagui/core";
import { Edit3 } from "@tamagui/lucide-icons";
import { PortalProvider } from "@tamagui/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

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
              <Stack.Screen
                name={ROUTES.root.name}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={ROUTES.authGroup.name}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={ROUTES.tabsGroup.name}
                options={{ headerShown: false, title: "" }}
              />

              <Stack.Screen
                name={ROUTES.create.name}
                options={{ presentation: "modal" }}
              />

              <Stack.Screen
                name={ROUTES.memoDetail.name}
                options={({
                  route,
                }: {
                  route: { params?: { id?: string } };
                }) => ({
                  title: ROUTES.memoDetail.label,
                  headerBackTitle: "",
                  headerBackButtonMenuEnabled: false,
                  headerRight: () => (
                    <XStack paddingRight="$3">
                      <Pressable
                        onPress={() =>
                          router.push(HREFS.memoEdit(String(route.params?.id ?? "")))
                        }
                      >
                        <Edit3 size={20} color="$textSecondary" />
                      </Pressable>
                    </XStack>
                  ),
                })}
              />

              <Stack.Screen
                name={ROUTES.memoEdit.name}
                options={{
                  title: ROUTES.memoEdit.label,
                  headerBackTitle: "",
                  headerBackButtonMenuEnabled: false,
                }}
              />

              <Stack.Screen
                name={ROUTES.search.name}
                options={{
                  title: ROUTES.search.label,
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
