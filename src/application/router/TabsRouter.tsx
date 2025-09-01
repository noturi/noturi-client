import { XStack, useTheme } from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';

import { Redirect, Tabs } from 'expo-router';

import { BarChart3, Home, Plus, User } from '@tamagui/lucide-icons';

import { useAuth } from '../../features/auth';
import { MemoCreateSheet } from '../../features/memo-crud';
import { HREFS } from '../../shared/constants';
import { Loading } from '../../shared/ui';

export function TabsRouter() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const theme = useTheme();

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
            backgroundColor: theme.backgroundSecondary.val,
          },
          headerTintColor: theme.textPrimary.val,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
          },
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 83,
            paddingBottom: 30,
            paddingTop: 5,
          },
          tabBarActiveTintColor: theme.primary.val,
          tabBarInactiveTintColor: theme.textMuted.val,
          tabBarItemStyle: {
            paddingVertical: 4,
            paddingHorizontal: 16,
            minHeight: 35,
            minWidth: 35,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Home color={color as any} fill={focused ? color : 'none'} size="$xl" />
            ),
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                  },
                ]}
                onPress={props.onPress}
              >
                {props.children}
              </Pressable>
            ),
            // headerRight: () => (
            //   <XStack paddingRight="$md">
            //     <Pressable style={{ padding: 8 }} onPress={() => router.push(HREFS.search())}>
            //       <Search size="$lg" />
            //     </Pressable>
            //   </XStack>
            // ),
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
            tabBarIcon: ({ color, focused }) => (
              <XStack backgroundColor={'$backgroundSecondary'} borderRadius="$xl" padding="$sm">
                <Plus color={focused ? 'white' : (color as any)} size="$xl" />
              </XStack>
            ),
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
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
          name="stats"
          options={{
            title: '통계',
            tabBarIcon: ({ color, focused }) => (
              <BarChart3 color={color as any} fill={focused ? color : 'none'} size="$xl" />
            ),
            tabBarButton: (props) => (
              <Pressable
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
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
            tabBarIcon: ({ color, focused }) => (
              <User color={color as any} fill={focused ? color : 'none'} size="$xl" />
            ),
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
