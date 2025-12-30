import { ChevronLeft } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';

import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ROUTES } from '../../shared/config';

export function RootRouter() {
  const { hexColors, isDark } = useUserTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: hexColors.bgSecondary,
          },
          headerTintColor: hexColors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 16,
          },
          headerShadowVisible: false,
          headerBackTitle: '',
          contentStyle: {
            backgroundColor: hexColors.bgSecondary,
          },
        }}
      >
        <Stack.Screen name={ROUTES.root.name} options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.login.name} options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.tabs.name} options={{ headerShown: false, title: '' }} />

        <Stack.Screen
          name={ROUTES.memoDetail.name}
          options={{
            title: '',
            headerBackTitle: '',
            headerBackButtonMenuEnabled: false,
          }}
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
                <ChevronLeft color={hexColors.textPrimary} size={24} />
              </Pressable>
            ),
          }}
        />

        <Stack.Screen
          name={ROUTES.memoCreate.name}
          options={{
            title: ROUTES.memoCreate.label,
            headerBackTitle: '',
            headerBackButtonMenuEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
