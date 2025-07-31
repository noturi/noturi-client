import { Typography } from "@/components/ui";
import {
  activeCategoriesQuery,
  useCreateCategoryMutation,
} from "@/services/category";
import { useCreateMemoMutation } from "@/services/memo";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import {
  Button,
  Input,
  ScrollView,
  Sheet,
  Spinner,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import { CategoryButton } from "./CategoryButton";
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
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { formData, updateField, resetForm, handleCategorySelect } =
    useMemoForm();

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      handleCategorySelect(newCategory.name);
      setNewCategoryName("");
      setShowAddCategory(false);
      Alert.alert("성공", "새 카테고리가 생성되었습니다.");
    },
    onError: (error: any) => {
      Alert.alert("오류", error.message || "카테고리 생성에 실패했습니다.");
    },
  });

  const createMemoMutation = useCreateMemoMutation({
    onSuccess: () => {
      resetForm();
      onClose();
      Alert.alert(MEMO_ALERTS.SUCCESS.title, MEMO_ALERTS.SUCCESS.message);
    },
    onError: (error: any) => {
      console.error("메모 생성 실패:", error);
      Alert.alert("오류", error.message || "메모 생성에 실패했습니다.");
    },
  });

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

  const isDisabled =
    (!formData.title.trim() && !formData.memoContent.trim()) || createMemoMutation.isPending;

  const handleSaveMemo = async () => {
    const { title, memoContent, selectedCategory, rating } = formData;

    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    if (!memoContent.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    // 카테고리 ID 찾기
    let categoryId: string;
    if (selectedCategory) {
      const selectedCat = categories.find(
        (cat) => cat.name === selectedCategory
      );
      if (!selectedCat) {
        Alert.alert("오류", "선택된 카테고리를 찾을 수 없습니다.");
        return;
      }
      categoryId = selectedCat.id;
    } else {
      Alert.alert("알림", "카테고리를 선택해주세요.");
      return;
    }

    createMemoMutation.mutate({
      title: title.trim(),
      content: memoContent.trim(),
      categoryId,
      rating,
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("알림", "카테고리 이름을 입력해주세요.");
      return;
    }

    createCategoryMutation.mutate({
      name: newCategoryName.trim(),
      color: "#3b82f6",
    });
  };

  const handleCancelAddCategory = () => {
    setNewCategoryName("");
    setShowAddCategory(false);
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
        <YStack flex={1} onStartShouldSetResponder={() => true}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
            }}
          >
            <YStack padding="$5" gap="$6">
              <YStack gap="$2">
                <Typography variant="title">제목</Typography>
                <TextArea
                  placeholder="제목을 입력하세요"
                  value={formData.title}
                  onChangeText={(text) => updateField("title", text)}
                  backgroundColor="$backgroundPrimary"
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius="$4"
                  fontSize="$4"
                  color="$textPrimary"
                  placeholderTextColor="$textMuted"
                  padding="$2"
                />
              </YStack>
              {/* Content Input */}
              <YStack gap="$3">
                <Typography variant="title">내용</Typography>
                <TextArea
                  placeholder="무엇을 기록하고 싶나요?"
                  value={formData.memoContent}
                  onChangeText={(text) => updateField("memoContent", text)}
                  minHeight={120}
                  backgroundColor="$backgroundTransparent"
                  borderWidth={0}
                  fontSize="$4"
                  color="$textPrimary"
                  placeholderTextColor="$textMuted"
                  multiline
                  padding="$0"
                />
              </YStack>
              <YStack gap="$3">
                <Typography variant="title">카테고리</Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2">
                    {categories.map((category) => (
                      <CategoryButton
                        key={category.id}
                        category={{
                          ...category,
                          active: formData.selectedCategory === category.name,
                          count: 0,
                        }}
                        onPress={() => handleCategorySelect(category.name)}
                      />
                    ))}
                    {!showAddCategory && (
                      <Button
                        backgroundColor="$surface"
                        borderWidth={1}
                        borderColor="$border"
                        borderStyle="dashed"
                        color="$textSecondary"
                        borderRadius="$5"
                        fontSize="$3"
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        minHeight={40}
                        minWidth={60}
                        pressStyle={{ backgroundColor: "$surfaceHover" }}
                        onPress={() => setShowAddCategory(true)}
                      >
                        + 추가
                      </Button>
                    )}
                  </XStack>
                </ScrollView>

                {showAddCategory && (
                  <XStack gap="$2" alignItems="center">
                    <Input
                      flex={1}
                      placeholder="새 카테고리 이름"
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      backgroundColor="$surface"
                      borderWidth={1}
                      borderColor="$border"
                      borderRadius="$4"
                      fontSize="$4"
                      color="$textPrimary"
                      placeholderTextColor="$textMuted"
                      paddingHorizontal="$3"
                      paddingVertical="$3"
                      maxLength={20}
                    />
                    <Button
                      size="$3"
                      height={48}
                      backgroundColor="$accent"
                      color="$textOnAccent"
                      onPress={handleAddCategory}
                      disabled={
                        !newCategoryName.trim() ||
                        createCategoryMutation.isPending
                      }
                      icon={
                        createCategoryMutation.isPending ? (
                          <Spinner size="small" color="$textOnAccent" />
                        ) : undefined
                      }
                    >
                      추가
                    </Button>
                    <Button
                      size="$3"
                      height={48}
                      backgroundColor="$backgroundTransparent"
                      color="$textSecondary"
                      borderWidth={1}
                      borderColor="$border"
                      onPress={handleCancelAddCategory}
                    >
                      취소
                    </Button>
                  </XStack>
                )}
              </YStack>
              <RatingSelector
                rating={formData.rating}
                onRatingChange={(rating) => updateField("rating", rating)}
              />
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
            createMemoMutation.isPending ? (
              <Spinner
                size="small"
                color={isDisabled ? "$textMuted" : "$textOnAccent"}
              />
            ) : undefined
          }
          animation="quick"
        >
          {!createMemoMutation.isPending && "등록"}
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
