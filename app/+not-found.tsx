import { FONT_SIZE } from '~/shared/config';

import { Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '페이지 없음',
          headerTitleStyle: { fontSize: FONT_SIZE[4] },
        }}
      />
    </>
  );
}
