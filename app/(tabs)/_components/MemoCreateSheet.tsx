import { Typography } from "@/components/ui";
import { activeCategoriesQuery } from "@/services/category";
import { memoService } from "@/services/memo/memoService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import { Button, ScrollView, Sheet, Spinner, TextArea, YStack } from "tamagui";
import { CategorySelector } from "./CategorySelector";
import { MEMO_ALERTS } from "./constants";
import { useMemoForm } from "./hooks/useMemoForm";
import { MemoFormHeader } from "./MemoFormHeader";
import { RatingSelector } from "./RatingSelector";

interface MemoCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoCreateSheet = ({ isOpen, onClose }: MemoCreateSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { formData, updateField, resetForm, handleCategorySelect } =
    useMemoForm();

  // 카테고리 데이터 가져오기
  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  // 키보드 이벤트 처리
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
      const keyboardHeight =
        Platform.OS === "ios"
          ? e.endCoordinates.height - 34
          : e.endCoordinates.height;
      setKeyboardHeight(keyboardHeight);
    });
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () =>
      setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const [isCreating, setIsCreating] = useState(false);

  const isDisabled = !formData.memoContent.trim() || isCreating;

  const handleSaveMemo = async () => {
    const { memoContent, selectedCategory, rating, description } = formData;

    // 카테고리 ID 찾기
    let categoryId: string;
    if (selectedCategory) {
      const selectedCat = categories.find((cat) => cat.name === selectedCategory);
      if (!selectedCat) {
        Alert.alert("오류", "선택된 카테고리를 찾을 수 없습니다.");
        return;
      }
      categoryId = selectedCat.id;
    } else {
      Alert.alert("알림", "카테고리를 선택해주세요.");
      return;
    }

    setIsCreating(true);
    try {
      // 서비스의 검증 포함 생성 메서드 사용
      await memoService.createMemoWithValidation({
        title: memoContent.split("\n")[0].substring(0, 50) || "제목 없음",
        content: memoContent,
        categoryId,
        rating,
        description,
      });

      resetForm();
      onClose();
      Alert.alert(MEMO_ALERTS.SUCCESS.title, MEMO_ALERTS.SUCCESS.message);
    } catch (error: any) {
      // 에러는 이미 글로벌 핸들러에서 처리되지만, 특별한 경우 추가 처리 가능
      console.error("메모 생성 실패:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[85, 50]}
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
        flex={1}
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$0"
      >
        <MemoFormHeader onClose={onClose} />

        {/* Content */}
        <YStack flex={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
            }}
          >
            <YStack padding="$5" gap="$6">
              {/* Main Text Input */}
              <YStack gap="$3">
                <TextArea
                  placeholder="무엇을 기록하고 싶나요?"
                  value={formData.memoContent}
                  onChangeText={(text) => updateField("memoContent", text)}
                  minHeight={120}
                  backgroundColor="$backgroundTransparent"
                  borderWidth={0}
                  fontSize="$5"
                  color="$textPrimary"
                  placeholderTextColor="$textMuted"
                  multiline
                  padding="$0"
                />
              </YStack>

              <CategorySelector
                categories={categories}
                selectedCategory={formData.selectedCategory}
                newCategory={formData.newCategory}
                onSelectCategory={handleCategorySelect}
                onNewCategoryChange={(text) => updateField("newCategory", text)}
              />

              <RatingSelector
                rating={formData.rating}
                onRatingChange={(rating) => updateField("rating", rating)}
              />

              {/* Description */}
              <YStack gap="$3">
                <Typography variant="title">추가 설명</Typography>
                <TextArea
                  placeholder="자세한 설명을 추가해보세요 (선택사항)"
                  value={formData.description}
                  onChangeText={(text) => updateField("description", text)}
                  minHeight={80}
                  backgroundColor="$backgroundPrimary"
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius="$4"
                  fontSize="$4"
                  color="$textPrimary"
                  placeholderTextColor="$textMuted"
                  multiline
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                />
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>

        {/* Floating Submit Button */}
        <Button
          position="absolute"
          bottom={keyboardHeight > 0 ? keyboardHeight + 50 : 30}
          right={20}
          width={60}
          height={40}
          backgroundColor={isDisabled ? "$surfaceDisabled" : "$accent"}
          color={isDisabled ? "$textMuted" : "$textOnAccent"}
          borderRadius="$6"
          pressStyle={{
            backgroundColor: isDisabled ? "$surfaceDisabled" : "$accentHover",
            scale: 0.95,
          }}
          onPress={handleSaveMemo}
          disabled={isDisabled}
          icon={
            isCreating ? (
              <Spinner
                size="small"
                color={isDisabled ? "$textMuted" : "$textOnAccent"}
              />
            ) : undefined
          }
          animation="quick"
        >
          {!isCreating && "등록"}
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
