import { ReactNode } from 'react';

import { AuthProvider } from '../../features/auth';
import { QueryProvider } from './QueryProvider';
import { TamaguiProvider } from './TamaguiProvider';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <TamaguiProvider>
        <AuthProvider>{children}</AuthProvider>
      </TamaguiProvider>
    </QueryProvider>
  );
}
