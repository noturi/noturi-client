import { Toaster } from 'sonner-native';
import { SheetProvider } from '~/shared/ui';

import { ReactNode } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { AuthProvider } from './auth-provider';
import { NotificationProvider } from './notification-provider';
import { OnlineStatusNotice } from './online-status-notice';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { UpdateCheckProvider } from './update-check-provider';
import { WidgetSyncProvider } from './widget-sync-provider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SheetProvider>
          <KeyboardProvider>
            <AuthProvider>
              <WidgetSyncProvider>
                <NotificationProvider>
                  <UpdateCheckProvider>
                    {children}
                    <Toaster />
                    <OnlineStatusNotice />
                  </UpdateCheckProvider>
                </NotificationProvider>
              </WidgetSyncProvider>
            </AuthProvider>
          </KeyboardProvider>
        </SheetProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
