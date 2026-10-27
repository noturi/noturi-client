import { FONT_SIZE, ROUTES, SPACING } from '~/shared/config';
import { ChevronLeft } from '~/shared/lib/icons';
import { useUserTheme } from '~/shared/lib/theme-context';

import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
            fontSize: FONT_SIZE[4],
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
              <Pressable style={{ padding: SPACING[3] }} onPress={() => router.back()}>
                <ChevronLeft className="text-text-primary" size={24} />
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

        <Stack.Screen
          name={ROUTES.todoCreate.name}
          options={{
            title: ROUTES.todoCreate.label,
            headerBackTitle: '',
            headerBackButtonMenuEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
