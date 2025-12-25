import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';

import { Pressable } from 'react-native';

import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';

import { ROUTES } from '../../shared/config';

export function RootRouter() {
  const { currentTheme, themeId } = useUserTheme();

  const bgColor = rgbToHex(currentTheme.colors.bgSecondary);
  const textColor = rgbToHex(currentTheme.colors.textPrimary);

  // 어두운 테마인지 확인 (상태바 스타일 결정용)
  const isDarkTheme = ['dark', 'navy', 'forest'].includes(themeId);

  return (
    <>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 16,
          },
          headerShadowVisible: false,
          headerBackTitle: '',
          contentStyle: {
            backgroundColor: bgColor,
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
                <ChevronLeft color={textColor} size={24} />
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
