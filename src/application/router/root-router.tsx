import { useTheme } from 'tamagui';

import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';

import { ChevronLeft } from '@tamagui/lucide-icons';

import { ROUTES } from '../../shared/constants';

export function RootRouter() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundSecondary.val,
        },
        headerTintColor: theme.textPrimary.val,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
        },
        headerShadowVisible: false,
        headerBackTitle: '',
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
              <ChevronLeft color="$primary" size="$4" />
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
  );
}
