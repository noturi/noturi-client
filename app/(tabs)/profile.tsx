import { Typography } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { useLogoutMutation } from "@/services/auth";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Button, Separator, YStack } from "tamagui";

export default function ProfileScreen() {
  const { isAuthenticated } = useAuth();
  
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      console.log("✅ 로그아웃 성공");
      // 로그인 화면으로 이동
      router.replace("/(auth)/login");
    },
    onError: (error) => {
      console.error("❌ 로그아웃 실패:", error);
      Alert.alert("오류", "로그아웃에 실패했습니다.");
    },
  });

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => {
            logoutMutation.mutate();
          },
        },
      ]
    );
  };

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary" padding="$4">
      <YStack gap="$4">
        {/* 프로필 정보 영역 (추후 구현) */}
        <YStack gap="$3" padding="$4" backgroundColor="$surface" borderRadius="$4">
          <Typography variant="heading" color="$textPrimary">
            프로필 정보
          </Typography>
          <Typography variant="body" color="$textSecondary">
            사용자 정보가 여기에 표시됩니다.
          </Typography>
        </YStack>

        <Separator borderColor="$border" />

        {/* 설정 영역 */}
        <YStack gap="$3">
          <Typography variant="subtitle" color="$textPrimary">
            계정 설정
          </Typography>
          
          {isAuthenticated && (
            <Button
              backgroundColor="$error"
              color="white"
              borderRadius="$4"
              height="$4"
              fontSize="$4"
              fontWeight="600"
              pressStyle={{
                backgroundColor: "$errorHover",
                opacity: 0.8,
              }}
              onPress={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </Button>
          )}
        </YStack>

        {/* 앱 정보 영역 */}
        <YStack gap="$3" marginTop="$6">
          <Typography variant="subtitle" color="$textPrimary">
            앱 정보
          </Typography>
          <YStack gap="$2">
            <Typography variant="body" color="$textSecondary">
              버전: 1.0.0
            </Typography>
            <Typography variant="body" color="$textSecondary">
              개발자: Noturi Team
            </Typography>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
