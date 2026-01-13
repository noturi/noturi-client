import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';

import { ReactNode } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AuthProvider } from './auth-provider';
import { NotificationProvider } from './notification-provider';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { UpdateCheckProvider } from './update-check-provider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <AuthProvider>
              <NotificationProvider>
                <UpdateCheckProvider>
                  {children}
                  <Toaster />
                </UpdateCheckProvider>
              </NotificationProvider>
            </AuthProvider>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
