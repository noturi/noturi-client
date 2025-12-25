import '../global.css';

import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider } from '../src/application/providers';
import { RootRouter } from '../src/application/router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Thin': require('../assets/fonts/Pretendard-Thin.ttf'),
    'Pretendard-ExtraLight': require('../assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretendard-Light': require('../assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-ExtraBold': require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    'Pretendard-Black': require('../assets/fonts/Pretendard-Black.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}
