import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import '../global.css';
import { AppProvider } from '../src/application/providers';
import { RootRouter } from '../src/application/router';
import '../src/shared/lib/polyfill';
import { Sentry, initSentry } from '../src/shared/lib/sentry';

initSentry();
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
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

// 렌더 중 발생한 에러·네이티브 크래시를 Sentry로 보고
export default Sentry.wrap(RootLayout);
