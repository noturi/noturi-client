import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Google Sign-in 설정
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    console.log("=== 네이티브 구글 로그인 시작 ===");
    setIsLoading(true);

    try {
      // Google에 로그인 가능한지 확인
      await GoogleSignin.hasPlayServices();

      // Google 로그인 실행
      const userInfo = await GoogleSignin.signIn();
      console.log("Google 로그인 성공:", userInfo);

      // 사용자 정보에서 필요한 데이터 추출
      const { user } = userInfo;
      console.log("사용자 정보:", user);

      // 사용자 정보를 서버로 전송
      await sendUserInfoToBackend(user);
    } catch (error) {
      console.error("Google 로그인 오류:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("사용자가 로그인을 취소했습니다.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("알림", "이미 로그인이 진행 중입니다.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("오류", "Google Play Services를 사용할 수 없습니다.");
      } else {
        Alert.alert("로그인 오류", "Google 로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 백엔드로 사용자 정보 전송
  const sendUserInfoToBackend = async (user: any) => {
    try {
      console.log("서버로 사용자 정보 전송 중...");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/auth/google/native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId: user.id,
            email: user.email,
            name: user.name,
            photo: user.photo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // 토큰 저장 (expo-secure-store 사용)
        // await SecureStore.setItemAsync('accessToken', data.accessToken);
        // await SecureStore.setItemAsync('refreshToken', data.refreshToken);

        router.replace("/(tabs)");
      } else {
        console.error("Backend error:", data);
        Alert.alert("로그인 실패", "서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Backend error:", error);
      Alert.alert("오류", "백엔드 연결에 실패했습니다.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack
        flex={1}
        backgroundColor="$background"
        justifyContent="center"
        alignItems="center"
        padding="$6"
      >
        <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
          노투리
        </Text>

        <Text
          fontSize="$3"
          color="$textSecondary"
          textAlign="center"
          marginBottom="$8"
        >
          당신의 생각을 기록하고{"\n"}정리하는 가장 쉬운 방법
        </Text>

        <Button
          size="$5"
          backgroundColor="$surface"
          borderColor="$border"
          borderWidth={1}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <XStack alignItems="center" gap="$3">
            <Text color="$textPrimary" fontSize="$3" fontWeight="600">
              {isLoading ? "로그인 중..." : "Google로 계속하기"}
            </Text>
          </XStack>
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
