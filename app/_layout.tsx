import { XStack } from 'tamagui';

import { useEffect } from 'react';
import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { TamaguiProvider } from '@tamagui/core';
import { ChevronLeft, Edit3 } from '@tamagui/lucide-icons';
import { PortalProvider } from '@tamagui/portal';

import { QueryClientProvider } from '@tanstack/react-query';

import { HREFS, ROUTES } from '@/constants';
import { AuthProvider } from '@/context/auth';
import { queryClient } from '@/services/queryClient';
import { config } from '@/tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <TamaguiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <AuthProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#ffffff',
                },
                headerTintColor: '#111827',
                headerTitleStyle: {
                  fontWeight: '600',
                  fontSize: 18,
                },
                headerShadowVisible: false,
                headerBackTitle: '',
              }}
            >
              <Stack.Screen name={ROUTES.root.name} options={{ headerShown: false }} />
              <Stack.Screen name={ROUTES.auth.name} options={{ headerShown: false }} />
              <Stack.Screen name={ROUTES.tabs.name} options={{ headerShown: false, title: '' }} />
              <Stack.Screen name={ROUTES.create.name} options={{ presentation: 'modal' }} />

              <Stack.Screen
                name={ROUTES.memoDetail.name}
                options={({ route }: { route: { params?: { id?: string } } }) => ({
                  title: ROUTES.memoDetail.label,
                  headerBackTitle: '',
                  headerBackButtonMenuEnabled: false,
                  headerRight: () => (
                    <XStack paddingRight="$3">
                      <Pressable
                        onPress={() => router.push(HREFS.memoEdit(String(route.params?.id ?? '')))}
                      >
                        <Edit3 color="$textSecondary" size={20} />
                      </Pressable>
                    </XStack>
                  ),
                })}
              />

              <Stack.Screen
                name={ROUTES.memoEdit.name}
                options={{
                  title: ROUTES.memoEdit.label,
                  headerBackTitle: '',
                  headerBackButtonMenuEnabled: false,
                }}
              />

              <Stack.Screen
                name={ROUTES.search.name}
                options={{
                  title: ROUTES.search.label,
                  headerTitle: '',
                  headerBackTitle: '',
                  headerBackVisible: false,
                  headerBackButtonMenuEnabled: false,
                  headerLeft: () => (
                    <Pressable style={{ padding: 8 }} onPress={() => router.back()}>
                      <ChevronLeft color="$primary" size={20} />
                    </Pressable>
                  ),
                }}
              />
            </Stack>
          </AuthProvider>
        </PortalProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
