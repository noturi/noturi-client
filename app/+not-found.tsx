import { Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '페이지 없음',
          headerTitleStyle: { fontSize: 16 },
        }}
      />
    </>
  );
}
