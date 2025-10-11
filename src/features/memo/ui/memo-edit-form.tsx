import { Button, ScrollView, XStack, YStack } from 'tamagui';
import type { CategoryFormData, MemoFormData } from '~/entities/memo/model/schemas';
import { categoryFormSchema, memoFormSchema } from '~/entities/memo/model/schemas';
import { activeCategoriesQuery, useCreateCategoryMutation } from '~/features/categories/api';
import { CategoryButton } from '~/features/categories/ui';
import { DEFAULT_COLORS, MESSAGES } from '~/shared/constants';
import { useForm, useToast } from '~/shared/lib';
import { Form, Input, Loading, SubmitButton, TextArea } from '~/shared/ui';

import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { memoDetailQuery, useUpdateMemoMutation } from '../api';
import { RatingSelector } from './rating-selector';

interface MemoEditFormProps {
  memoId: string;
  onSuccess?: () => void;
}

export const MemoEditForm = ({ memoId, onSuccess }: MemoEditFormProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const toast = useToast();

  const { data: memo, isLoading } = useQuery(memoDetailQuery(memoId));
  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const memoForm = useForm<MemoFormData>({
    initialValues: {
      title: '',
      content: '',
      rating: 0,
      selectedCategory: '',
    },
    validationSchema: memoFormSchema,
    onSubmit: async (values) => {
      const selectedCat = categories.find((cat) => cat.name === values.selectedCategory);
      if (!selectedCat) {
        memoForm.setError('selectedCategory', {
          message: '카테고리를 선택해주세요.',
          type: 'required',
        });
        return;
      }

      updateMemoMutation.mutate({
        id: memoId,
        title: values.title,
        content: values.content,
        categoryId: selectedCat.id,
        rating: values.rating,
      });
    },
  });

  const categoryForm = useForm<CategoryFormData>({
    initialValues: { name: '' },
    validationSchema: categoryFormSchema,
  });

  // 메모 데이터로 폼 초기화
  useEffect(() => {
    if (memo) {
      memoForm.setValue('title', memo.title);
      memoForm.setValue('content', memo.content);
      memoForm.setValue('rating', Number(memo.rating));
      memoForm.setValue('selectedCategory', memo.category.name);
    }
  }, [memo]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e) => {
      const height = Platform.OS === 'ios' ? e.endCoordinates.height - 34 : e.endCoordinates.height;
      setKeyboardHeight(height);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      memoForm.setValue('selectedCategory', newCategory.name);
      categoryForm.reset();
      setShowAddCategory(false);
      toast.showSuccess(MESSAGES.CATEGORY.CREATE_SUCCESS);
    },
  });

  const updateMemoMutation = useUpdateMemoMutation({
    onSuccess: () => {
      toast.showSuccess(MESSAGES.MEMO.UPDATE_SUCCESS);
      onSuccess?.();
    },
  });

  const handleAddCategory = async () => {
    createCategoryMutation.mutate({
      name: categoryForm.values.name,
      color: DEFAULT_COLORS,
    });
  };

  const handleCancelAddCategory = () => {
    categoryForm.reset();
    setShowAddCategory(false);
  };

  const handleCategorySelect = (categoryName: string) => {
    memoForm.setValue('selectedCategory', categoryName);
  };

  const shouldShowTitleError = memoForm.shouldShowError('title');
  const titleError = shouldShowTitleError ? memoForm.errors.title : undefined;

  const shouldShowContentError = memoForm.shouldShowError('content');
  const contentError = shouldShowContentError ? memoForm.errors.content : undefined;

  if (isLoading) {
    return (
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <Loading text="메모를 불러오는 중..." />
      </YStack>
    );
  }

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <YStack padding="$4">
          <Form>
            <Form.Field required error={titleError} label="제목">
              <Input
                autoFocus
                hasError={!!shouldShowTitleError}
                placeholder="제목을 입력하세요"
                value={memoForm.values.title}
                onBlur={() => memoForm.setTouched('title')}
                onChangeText={(text) => memoForm.setValue('title', text)}
              />
            </Form.Field>

            <Form.Field required error={contentError} label="내용">
              <TextArea
                multiline
                hasError={!!shouldShowContentError}
                placeholder="무엇을 기록하고 싶나요?"
                value={memoForm.values.content}
                onBlur={() => memoForm.setTouched('content')}
                onChangeText={(text) => memoForm.setValue('content', text)}
              />
            </Form.Field>

            <Form.Field
              required
              error={
                memoForm.shouldShowError('selectedCategory')
                  ? memoForm.errors.selectedCategory
                  : undefined
              }
              label="카테고리"
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2">
                  {categories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      category={{
                        ...category,
                        active: memoForm.values.selectedCategory === category.name,
                        count: 0,
                      }}
                      onPress={() => handleCategorySelect(category.name)}
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
                      fontSize={14}
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
                <XStack alignItems="center" gap="$2" marginTop="$3">
                  <YStack flex={1}>
                    <Form.Field
                      error={
                        categoryForm.shouldShowError('name') ? categoryForm.errors.name : undefined
                      }
                    >
                      <Input
                        hasError={!!categoryForm.shouldShowError('name')}
                        maxLength={20}
                        placeholder="새 카테고리 이름"
                        value={categoryForm.values.name}
                        onBlur={() => categoryForm.setTouched('name')}
                        onChangeText={(text) => categoryForm.setValue('name', text)}
                      />
                    </Form.Field>
                  </YStack>
                  <XStack alignItems="center" gap="$2">
                    <Button
                      backgroundColor="$textPrimary"
                      borderRadius="$6"
                      color="$textOnPrimary"
                      disabled={!categoryForm.isValid || createCategoryMutation.isPending}
                      fontSize={14}
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
                      fontSize={14}
                      minHeight={40}
                      minWidth={60}
                      onPress={handleCancelAddCategory}
                    >
                      취소
                    </Button>
                  </XStack>
                </XStack>
              )}
            </Form.Field>

            <Form.Field label="평점">
              <RatingSelector
                rating={Number(memoForm.values.rating)}
                onRatingChange={(rating) => memoForm.setValue('rating', Number(rating))}
              />
            </Form.Field>
          </Form>
        </YStack>
      </ScrollView>

      <SubmitButton
        isLoading={updateMemoMutation.isPending}
        loadingText="저장중..."
        onPress={() => {
          memoForm.handleSubmit();
        }}
      >
        저장
      </SubmitButton>
    </YStack>
  );
};
