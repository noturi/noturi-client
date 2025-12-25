import { Toaster } from 'sonner-native';

import { ReactNode } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ThemeProvider } from '~/features/theme';

import { AuthProvider } from './auth-provider';
import { NotificationProvider } from './notification-provider';
import { QueryProvider } from './query-provider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <KeyboardProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
