import { Button, ScrollView, TextArea, XStack, YStack } from 'tamagui';

import { useEffect, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

import { CategoryButton } from '@/components/category';
import { RatingSelector } from '@/components/memo/RatingSelector';
import { Loading, Typography } from '@/components/ui';
import { useToast } from '@/hooks';
import { activeCategoriesQuery, useCreateCategoryMutation } from '@/services/category';
import { memoDetailQuery, useUpdateMemoMutation } from '@/services/memo';

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;
  const toast = useToast();

  const { data: memo, isLoading } = useQuery(memoDetailQuery(memoId));
  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
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
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
      const keyboardHeight =
        Platform.OS === 'ios' ? e.endCoordinates.height - 34 : e.endCoordinates.height;
      setKeyboardHeight(keyboardHeight);
    });
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName('');
      setShowAddCategory(false);
      toast.showSuccess('새 카테고리가 생성되었습니다.');
    },
  });

  const updateMemoMutation = useUpdateMemoMutation({
    onSuccess: () => {
      toast.showSuccess('메모가 수정되었습니다.');
      router.back();
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('알림', '카테고리를 선택해주세요.');
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
      Alert.alert('알림', '카테고리 이름을 입력해주세요.');
      return;
    }

    createCategoryMutation.mutate({
      name: newCategoryName.trim(),
      color: '#000000',
    });
  };

  if (isLoading) {
    return (
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <Loading text="메모를 불러오는 중..." />
      </YStack>
    );
  }

  const isDisabled = updateMemoMutation.isPending;

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 100 : 100,
        }}
        flex={1}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <YStack gap="$4" padding="$4">
          {/* 제목 */}
          <YStack gap="$2">
            <Typography variant="title">제목</Typography>
            <TextArea
              backgroundColor="$backgroundSecondary"
              borderRadius="$6"
              borderWidth={0}
              color="$textPrimary"
              fontSize="$4"
              maxHeight={48}
              multiline={false}
              padding="$3"
              placeholder="제목을 입력하세요"
              placeholderTextColor="$textMuted"
              value={title}
              onChangeText={setTitle}
            />
          </YStack>

          {/* 내용 */}
          <YStack gap="$2">
            <Typography variant="title">내용</Typography>
            <TextArea
              multiline
              backgroundColor="$backgroundSecondary"
              borderRadius="$6"
              borderWidth={0}
              color="$textPrimary"
              fontSize="$4"
              minHeight={120}
              padding="$3"
              placeholder="무엇을 기록하고 싶나요?"
              placeholderTextColor="$textMuted"
              value={content}
              onChangeText={setContent}
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
                    borderColor="$border"
                    borderRadius="$5"
                    borderStyle="dashed"
                    borderWidth={1}
                    color="$textSecondary"
                    fontSize="$3"
                    minHeight={40}
                    minWidth={60}
                    pressStyle={{ backgroundColor: '$surfaceHover' }}
                    onPress={() => setShowAddCategory(true)}
                  >
                    + 추가
                  </Button>
                )}
              </XStack>
            </ScrollView>

            {showAddCategory && (
              <XStack alignItems="center" gap="$4">
                <TextArea
                  backgroundColor="$backgroundSecondary"
                  borderRadius="$6"
                  borderWidth={0}
                  color="$textPrimary"
                  flex={1}
                  fontSize="$4"
                  maxHeight={48}
                  maxLength={20}
                  multiline={false}
                  padding="$3"
                  placeholder="새 카테고리 이름"
                  placeholderTextColor="$textMuted"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />
                <XStack alignItems="center" gap="$2">
                  <Button
                    backgroundColor="$textPrimary"
                    borderRadius="$6"
                    color="$textOnPrimary"
                    disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                    fontSize="$3"
                    minHeight={40}
                    minWidth={60}
                    onPress={handleAddCategory}
                  >
                    추가
                  </Button>
                  <Button
                    backgroundColor="$surface"
                    borderColor="$border"
                    borderRadius="$6"
                    borderWidth={1}
                    color="$textSecondary"
                    fontSize="$3"
                    minHeight={40}
                    minWidth={60}
                    onPress={() => {
                      setNewCategoryName('');
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
            <RatingSelector rating={rating} onRatingChange={setRating} />
          </YStack>
        </YStack>
      </ScrollView>

      {/* 저장 버튼 */}
      <Button
        animation="quick"
        backgroundColor={isDisabled ? '$surfaceDisabled' : '$primary'}
        borderRadius="$6"
        bottom={keyboardHeight > 0 ? keyboardHeight + 50 : 30}
        color={isDisabled ? '$textMuted' : '$textOnPrimary'}
        disabled={isDisabled}
        position="absolute"
        pressStyle={{
          backgroundColor: isDisabled ? '$surfaceDisabled' : '$primaryHover',
          scale: 0.95,
        }}
        right={20}
        size="$5"
        onPress={handleSave}
      >
        {updateMemoMutation.isPending ? '저장중...' : '저장'}
      </Button>
    </YStack>
  );
}
