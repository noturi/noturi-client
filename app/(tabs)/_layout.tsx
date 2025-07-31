import { MemoCreateSheet } from "@/components/memo";
import { Loading } from "@/components/ui";
import { useAuth } from "@/context/auth";
import {
  BarChart3,
  Home,
  MessageSquare,
  Plus,
  Search,
  Settings,
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
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#0066CC",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        {/* 홈 - 기록 보기 */}
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <Home size={20} />,
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
          name="threads"
          options={{
            title: "메모 추가",
            tabBarIcon: ({ color }) => <MessageSquare size={20} />,
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <Plus size={20} />,
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
          name="profile"
          options={{
            title: "프로필",
            tabBarIcon: ({ color }) => <BarChart3 size={20} />,
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
