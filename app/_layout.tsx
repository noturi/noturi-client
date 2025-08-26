import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { AppProvider } from '../src/application/providers';
import { RootRouter } from '../src/application/router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}
