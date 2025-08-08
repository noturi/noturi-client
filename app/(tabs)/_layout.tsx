import { XStack } from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';

import { Redirect, Tabs, router } from 'expo-router';

import { BarChart3, Home, Plus, Search, Settings, User } from '@tamagui/lucide-icons';

import { MemoCreateSheet } from '@/components/memo';
import { Loading } from '@/components/ui';
import { HREFS } from '@/constants/routes';
import { useAuth } from '@/context/auth';

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
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#111827',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 16,
          },
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <Home color={color as any} size={20} />,
            headerRight: () => (
              <XStack paddingRight="$3">
                <Pressable style={{ padding: 8 }} onPress={() => router.push(HREFS.search())}>
                  <Search size={20} />
                </Pressable>
              </XStack>
            ),
          }}
        />

        <Tabs.Screen
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              setIsSheetOpen(true);
            },
          })}
          name="create"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <Plus color={color as any} size={20} />,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: '통계',
            tabBarIcon: ({ color }) => <BarChart3 color={color as any} size={20} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: '프로필',
            tabBarIcon: ({ color }) => <User color={color as any} size={20} />,
            headerRight: () => (
              <Pressable
                style={{ padding: 8, marginRight: 12 }}
                onPress={() => router.push('/profile')}
              >
                <Settings size={20} />
              </Pressable>
            ),
          }}
        />
      </Tabs>

      <MemoCreateSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
