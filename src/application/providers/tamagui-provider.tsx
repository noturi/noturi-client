import { ReactNode } from 'react';

import { TamaguiProvider as BaseTamaguiProvider } from '@tamagui/core';
import { PortalProvider } from '@tamagui/portal';

import { config } from '../../../tamagui.config';

interface TamaguiProviderProps {
  children: ReactNode;
}

export function TamaguiProvider({ children }: TamaguiProviderProps) {
  return (
    <BaseTamaguiProvider config={config}>
      <PortalProvider>{children}</PortalProvider>
    </BaseTamaguiProvider>
  );
}
