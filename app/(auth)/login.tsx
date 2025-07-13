import { useGoogleLoginMutation } from "@/services/auth";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";
import { useAuth } from "../../context/auth";

export default function LoginScreen() {
  const { saveAuthTokens, error, clearError } = useAuth();

  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: async (loginResponse) => {
      console.log("Login successful:", loginResponse);

      await saveAuthTokens({
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        user: loginResponse.user,
      });

      router.replace("/(tabs)");
    },
    onError: (error) => {
      console.error("Backend error:", error);
      Alert.alert("로그인 실패", "서버 오류가 발생했습니다.");
    },
  });

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("오류", error, [
        {
          text: "확인",
          onPress: clearError,
        },
      ]);
    }
  }, [error, clearError]);

  const handleGoogleLogin = async () => {
    console.log("=== 네이티브 구글 로그인 시작 ===");

    try {
      clearError();

      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();
      console.log("Google 로그인 응답:", response);

      if (isSuccessResponse(response)) {
        const user = response.data;
        console.log("사용자 정보:", user);

        googleLoginMutation.mutate({
          googleId: user.user.id,
          email: user.user.email,
          name: user.user.name,
          photo: user.user.photo,
        });
      } else {
        console.log("로그인이 취소되었습니다.");
      }
    } catch (error: any) {
      console.error("Google 로그인 오류:", error);

      let errorMessage = "Google 로그인에 실패했습니다.";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("사용자가 로그인을 취소했습니다.");
        return; // 취소는 에러로 처리하지 않음
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "이미 로그인이 진행 중입니다.";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Google Play Services를 사용할 수 없습니다.";
      }

      Alert.alert("로그인 오류", errorMessage);
    }
  };

  const isLoading = googleLoginMutation.isPending;

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
