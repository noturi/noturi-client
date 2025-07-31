import { CategoryButton } from "@/components/category";
import { Typography } from "@/components/ui";
import { RatingSelector } from "@/components/memo/RatingSelector";
import {
  activeCategoriesQuery,
  useCreateCategoryMutation,
} from "@/services/category";
import { memoDetailQuery, useUpdateMemoMutation } from "@/services/memo";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Platform } from "react-native";
import {
  Button,
  ScrollView,
  Spinner,
  TextArea,
  XStack,
  YStack,
} from "tamagui";

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;

  const { data: memo, isLoading } = useQuery(memoDetailQuery(memoId));
  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  // 폼 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 메모 데이터로 폼 초기화
  useEffect(() => {
    if (memo) {
      setTitle(memo.title);
      setContent(memo.content);
      setRating(memo.rating);
      setSelectedCategoryId(memo.category.id);
    }
  }, [memo]);

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

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName("");
      setShowAddCategory(false);
      Alert.alert("성공", "새 카테고리가 생성되었습니다.");
    },
    onError: (error: any) => {
      Alert.alert("오류", error.message || "카테고리 생성에 실패했습니다.");
    },
  });

  const updateMemoMutation = useUpdateMemoMutation({
    onSuccess: () => {
      Alert.alert("성공", "메모가 수정되었습니다.", [
        { text: "확인", onPress: () => router.back() }
      ]);
    },
    onError: (error: any) => {
      Alert.alert("오류", error.message || "메모 수정에 실패했습니다.");
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert("알림", "카테고리를 선택해주세요.");
      return;
    }

    updateMemoMutation.mutate({
      id: memoId,
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId,
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

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$backgroundPrimary">
        <Spinner size="large" color="$accent" />
        <Typography variant="body" color="$textMuted" marginTop="$3">
          메모를 불러오는 중...
        </Typography>
      </YStack>
    );
  }

  const isDisabled = updateMemoMutation.isPending;

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 100 : 100,
        }}
      >
        <YStack padding="$4" gap="$4">
          {/* 제목 */}
          <YStack gap="$2">
            <Typography variant="title">제목</Typography>
            <TextArea
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
              backgroundColor="$backgroundSecondary"
              borderWidth={0}
              borderRadius="$6"
              fontSize="$4"
              color="$textPrimary"
              placeholderTextColor="$textMuted"
              padding="$3"
              maxHeight={48}
              multiline={false}
            />
          </YStack>

          {/* 내용 */}
          <YStack gap="$2">
            <Typography variant="title">내용</Typography>
            <TextArea
              placeholder="무엇을 기록하고 싶나요?"
              value={content}
              onChangeText={setContent}
              minHeight={120}
              backgroundColor="$backgroundSecondary"
              borderWidth={0}
              borderRadius="$6"
              fontSize="$4"
              color="$textPrimary"
              placeholderTextColor="$textMuted"
              multiline
              padding="$3"
            />
          </YStack>

          {/* 카테고리 */}
          <YStack gap="$2">
            <Typography variant="title">카테고리</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2">
                {categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={{
                      ...category,
                      active: selectedCategoryId === category.id,
                      count: 0,
                    }}
                    onPress={() => setSelectedCategoryId(category.id)}
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
              <XStack gap="$4" alignItems="center">
                <TextArea
                  flex={1}
                  placeholder="새 카테고리 이름"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  backgroundColor="$backgroundSecondary"
                  borderWidth={0}
                  borderRadius="$6"
                  fontSize="$4"
                  color="$textPrimary"
                  placeholderTextColor="$textMuted"
                  padding="$3"
                  maxLength={20}
                  maxHeight={48}
                  multiline={false}
                />
                <XStack gap="$2" alignItems="center">
                  <Button
                    backgroundColor="$textPrimary"
                    color="$textOnPrimary"
                    borderRadius="$6"
                    onPress={handleAddCategory}
                    disabled={
                      !newCategoryName.trim() ||
                      createCategoryMutation.isPending
                    }
                    minHeight={40}
                    minWidth={60}
                    fontSize="$3"
                  >
                    추가
                  </Button>
                  <Button
                    backgroundColor="$surface"
                    color="$textSecondary"
                    borderWidth={1}
                    borderRadius="$6"
                    borderColor="$border"
                    minHeight={40}
                    minWidth={60}
                    fontSize="$3"
                    onPress={() => {
                      setNewCategoryName("");
                      setShowAddCategory(false);
                    }}
                  >
                    취소
                  </Button>
                </XStack>
              </XStack>
            )}
          </YStack>

          {/* 평점 */}
          <YStack gap="$2">
            <Typography variant="title">평점</Typography>
            <RatingSelector
              rating={rating}
              onRatingChange={setRating}
            />
          </YStack>
        </YStack>
      </ScrollView>

      {/* 저장 버튼 */}
      <Button
        position="absolute"
        bottom={keyboardHeight > 0 ? keyboardHeight + 50 : 30}
        right={20}
        size="$5"
        backgroundColor={isDisabled ? "$surfaceDisabled" : "$primary"}
        color={isDisabled ? "$textMuted" : "$textOnPrimary"}
        borderRadius="$6"
        pressStyle={{
          backgroundColor: isDisabled ? "$surfaceDisabled" : "$primaryHover",
          scale: 0.95,
        }}
        onPress={handleSave}
        disabled={isDisabled}
        animation="quick"
      >
        {updateMemoMutation.isPending ? "저장중..." : "저장"}
      </Button>
    </YStack>
  );
}