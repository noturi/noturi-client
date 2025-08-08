import { MemoCreateSheet } from "@/components/memo";
import { Loading } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { HREFS } from "@/constants/routes";
import {
  BarChart3,
  Home,
  Plus,
  Search,
  Settings,
  User,
} from "@tamagui/lucide-icons";
import { Redirect, Tabs, router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { XStack } from "tamagui";

export default function TabsLayout() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
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
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        {/* 홈 - 기록 보기 */}
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <Home size={20} color={color as any} />,
            headerRight: () => (
              <XStack paddingRight="$3">
                <Pressable
                  onPress={() => router.push(HREFS.search())}
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
            title: "",
            tabBarIcon: ({ color }) => <Plus size={20} color={color as any} />,
            headerShown: false,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              setIsSheetOpen(true);
            },
          })}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: "통계",
            tabBarIcon: ({ color }) => (
              <BarChart3 size={20} color={color as any} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "프로필",
            tabBarIcon: ({ color }) => <User size={20} color={color as any} />,
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

      <MemoCreateSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
}
