import { ReactNode } from 'react';
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
    <QueryProvider>
      <TamaguiProvider>
        <KeyboardProvider>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </KeyboardProvider>
      </TamaguiProvider>
    </QueryProvider>
  );
}
