import { AgreementPage } from '~/pages/agreement';

import { Stack } from 'expo-router';

export default function Agreement() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AgreementPage />
    </>
  );
}
