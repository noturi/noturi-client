import { Typography } from "@/components/ui";
import { useCreateCategoryMutation } from "@/services/category";
import { useState } from "react";
import { Alert } from "react-native";
import { Button, Input, Sheet, Spinner, XStack, YStack } from "tamagui";
import { X } from "@tamagui/lucide-icons";

interface CategoryAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoryName: string) => void;
}

export const CategoryAddSheet = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CategoryAddSheetProps) => {
  const [categoryName, setCategoryName] = useState("");
  
  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      setCategoryName("");
      onSuccess?.(newCategory.name);
      onClose();
      Alert.alert("성공", "새 카테고리가 생성되었습니다.");
    },
    onError: (error: any) => {
      Alert.alert("오류", error.message || "카테고리 생성에 실패했습니다.");
    }
  });

  const handleCreate = () => {
    if (!categoryName.trim()) {
      Alert.alert("알림", "카테고리 이름을 입력해주세요.");
      return;
    }

    createCategoryMutation.mutate({
      name: categoryName.trim(),
      color: "#3b82f6" // 기본 파란색
    });
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={handleClose}
      snapPoints={[40]}
      snapPointsMode="percent"
      dismissOnSnapToBottom
      modal
      animation="quick"
    >
      <Sheet.Overlay
        animation="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="$backgroundOverlay"
      />
      <Sheet.Frame
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$0"
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$5"
          paddingVertical="$4"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <Typography variant="title">새 카테고리 추가</Typography>
          <Button
            size="$3"
            circular
            chromeless
            icon={<X size={20} />}
            onPress={handleClose}
          />
        </XStack>

        {/* Content */}
        <YStack padding="$5" gap="$4">
          <YStack gap="$2">
            <Typography variant="subtitle">카테고리 이름</Typography>
            <Input
              placeholder="카테고리 이름을 입력하세요"
              value={categoryName}
              onChangeText={setCategoryName}
              backgroundColor="$backgroundPrimary"
              borderWidth={1}
              borderColor="$border"
              borderRadius="$4"
              fontSize="$4"
              color="$textPrimary"
              placeholderTextColor="$textMuted"
              paddingHorizontal="$4"
              paddingVertical="$3"
              maxLength={20}
            />
          </YStack>

          <XStack gap="$3" marginTop="$2">
            <Button
              flex={1}
              backgroundColor="$surface"
              borderWidth={1}
              borderColor="$border"
              color="$textSecondary"
              onPress={handleClose}
            >
              취소
            </Button>
            <Button
              flex={1}
              backgroundColor="$accent"
              color="$textOnAccent"
              onPress={handleCreate}
              disabled={!categoryName.trim() || createCategoryMutation.isPending}
              icon={
                createCategoryMutation.isPending ? (
                  <Spinner size="small" color="$textOnAccent" />
                ) : undefined
              }
            >
              {createCategoryMutation.isPending ? "생성 중..." : "생성"}
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};