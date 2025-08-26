import { XStack } from 'tamagui';

import { useState } from 'react';
import { Alert, Pressable } from 'react-native';

import { Redirect, Tabs, router } from 'expo-router';

import { BarChart3, Home, Plus, Search, User } from '@tamagui/lucide-icons';

import { useAuth } from '../../features/auth';
import { MemoCreateSheet } from '../../features/memo-crud';
import { HREFS } from '../../shared/constants';
import { Loading } from '../../shared/ui';

export function TabsRouter() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (isInitialLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={HREFS.login()} />;
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
          tabBarItemStyle: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            minHeight: 60,
            minWidth: 60,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <Home color={color as any} size={20} />,
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={props.onPress}
              >
                {props.children}
              </Pressable>
            ),
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
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={props.onPress}
              >
                {props.children}
              </Pressable>
            ),
            headerShown: false,
          }}
        />

        <Tabs.Screen
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              Alert.alert('준비중', '통계 기능은 현재 준비 중입니다.');
            },
          })}
          name="stats"
          options={{
            title: '통계',
            tabBarIcon: ({ color }) => <BarChart3 color={color as any} size={20} />,
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={props.onPress}
              >
                {props.children}
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: '프로필',
            tabBarIcon: ({ color }) => <User color={color as any} size={20} />,
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  },
                ]}
                onPress={props.onPress}
              >
                {props.children}
              </Pressable>
            ),
          }}
        />
      </Tabs>

      <MemoCreateSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
}
