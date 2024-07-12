import { router } from "expo-router";
import { useEffect } from "react";
import { Text, YStack } from "tamagui";

export default function IndexScreen() {
  useEffect(() => {
    // TODO: 로그인 상태 체크 로직 추가
    router.replace("/(auth)/login");
  }, []);

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text>로딩중...</Text>
    </YStack>
  );
}
