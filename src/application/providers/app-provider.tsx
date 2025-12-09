import { Toaster } from 'sonner-native';

import { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AuthProvider } from './auth-provider';
import { NotificationProvider } from './notification-provider';
import { QueryProvider } from './query-provider';
import { TamaguiProvider } from './tamagui-provider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <TamaguiProvider>
          <KeyboardProvider>
            <AuthProvider>
              <NotificationProvider>
                {children}
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </KeyboardProvider>
        </TamaguiProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
