import { useAuth } from "@/context/auth";
import {
  BarChart3,
  Home,
  PlusCircle,
  Search,
  Settings,
} from "@tamagui/lucide-icons";
import { Redirect, Tabs, router } from "expo-router";
import { Pressable } from "react-native";
import { Spinner, XStack, YStack } from "tamagui";

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
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#111827",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 16,
        },
        headerShadowVisible: false,
        headerTitleAlign: "left",
      }}
    >
      {/* 홈 - 기록 보기 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => <Home size={size} />,
          headerRight: () => (
            <XStack paddingRight="$3">
              <Pressable
                onPress={() => router.push("/search")}
                style={{ padding: 8 }}
              >
                <Search size={20} />
              </Pressable>
            </XStack>
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "기록 작성",
          tabBarLabel: "등록",
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarLabel: "프로필",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} />,
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/profile")}
              style={{ padding: 8, marginRight: 12 }}
            >
              <Settings size={20} />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
