import { XStack, useTheme, Text } from 'tamagui';

import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';

import { ChevronLeft, Edit3 } from '@tamagui/lucide-icons';

import { HREFS, ROUTES } from '../../shared/constants';

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
          fontSize: 18,
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
        options={({ route }: { route: { params?: { id?: string } } }) => ({
          title: ROUTES.memoDetail.label,
          headerBackTitle: '',
          headerBackButtonMenuEnabled: false,
          headerRight: () => (
            <XStack paddingRight="$3">
              <Pressable
                onPress={() => router.push(HREFS.memoEdit(String(route.params?.id ?? '')))}
              >
                <Edit3 color="$textSecondary" size="$4" />
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
              <ChevronLeft color="$primary" size="$4" />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name={ROUTES.memoCreateRating.name}
        options={{
          title: ROUTES.memoCreateRating.label,
          headerBackTitle: '',
          headerBackButtonMenuEnabled: false,
        }}
      />

      <Stack.Screen
        name={ROUTES.memoCreateText.name}
        options={{
          title: ROUTES.memoCreateText.label,
          headerBackTitle: '',
          headerBackButtonMenuEnabled: false,
        }}
      />
    </Stack>
  );
}
