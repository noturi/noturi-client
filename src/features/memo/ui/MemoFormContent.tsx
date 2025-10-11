import { ScrollView, XStack, YStack } from 'tamagui';
import type { CategoryFormData, MemoFormData } from '~/entities/memo/model/schemas';
import { categoryFormSchema, memoFormSchema } from '~/entities/memo/model/schemas';
import { useCreateCategoryMutation } from '~/features/categories/api/mutations';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { CategoryButton } from '~/features/categories/ui/CategoryButton';
import { useCreateMemoMutation } from '~/features/memo/api/mutations';
import { DEFAULT_COLORS } from '~/shared/constants/colors';
import { MESSAGES } from '~/shared/constants/messages';
import { useForm, useToast } from '~/shared/lib';
import { Button, Form, Input, SubmitButton, TextArea } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { RatingSelector } from './RatingSelector';

interface MemoFormContentProps {
  keyboardHeight: number;
  onSuccess?: () => void;
  shouldAutoFocus?: boolean;
}

export const MemoFormContent = ({
  keyboardHeight,
  onSuccess,
  shouldAutoFocus = false,
}: MemoFormContentProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const titleInputRef = useRef<any>(null);
  const toast = useToast();

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const memoForm = useForm<MemoFormData>({
    initialValues: {
      text: '',
      rating: 0,
      selectedCategory: '',
    },
    validationSchema: memoFormSchema,
    onSubmit: async (values) => {
      // 첫 번째 줄을 제목으로, 나머지를 내용으로 분리
      const lines = values.text.split('\n');
      let title = lines[0].trim() || '제목 없음';
      let content = lines.slice(1).join('\n').trim();

      // 제목이 30자를 넘으면 잘라서 나머지는 내용에 추가
      if (title.length > 30) {
        const truncatedTitle = title.substring(0, 30);
        const remainingText = title.substring(30);
        title = truncatedTitle;
        content = remainingText + (content ? '\n' + content : '');
      }

      // 카테고리가 선택된 경우에만 categoryId 포함
      const selectedCat = values.selectedCategory
        ? categories.find((cat) => cat.name === values.selectedCategory)
        : null;

      const memoData: any = {
        title,
        content: content || '',
      };

      // categoryId가 있을 때만 추가
      if (selectedCat?.id) {
        memoData.categoryId = selectedCat.id;
      }

      // rating이 0보다 클 때만 추가
      if (values.rating > 0) {
        memoData.rating = values.rating;
      }

      createMemoMutation.mutate(memoData);
    },
  });

  const categoryForm = useForm<CategoryFormData>({
    initialValues: {
      name: '',
    },
    validationSchema: categoryFormSchema,
  });

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      memoForm.setValue('selectedCategory', newCategory.name);
      categoryForm.reset();
      setShowAddCategory(false);
      toast.showSuccess(MESSAGES.CATEGORY.CREATE_SUCCESS);
    },
    onError: () => {
      categoryForm.setError('name', {
        message: '카테고리 생성 중 오류가 발생했습니다.',
        type: 'server',
      });
    },
  });

  const createMemoMutation = useCreateMemoMutation({
    onSuccess: () => {
      toast.showSuccess(MESSAGES.MEMO.CREATE_SUCCESS);
      memoForm.reset();
      onSuccess?.();
    },
    onError: () => {
      memoForm.setError('text', { message: '메모 등록 중 오류가 발생했습니다.', type: 'server' });
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

  useEffect(() => {
    if (!shouldAutoFocus) return;

    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [shouldAutoFocus]);

  const shouldShowTextError = memoForm.shouldShowError('text');
  const shouldShowSelectedCategoryError = memoForm.shouldShowError('selectedCategory');
  const selectedCategoryError = shouldShowSelectedCategoryError
    ? memoForm.errors.selectedCategory
    : undefined;

  const textError = shouldShowTextError ? memoForm.errors.text : undefined;

  return (
    <>
      <YStack flex={1} padding="$4" onStartShouldSetResponder={() => true}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 120 : 120,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Form>
            <Form.Field required error={textError} label="메모">
              <TextArea
                ref={titleInputRef}
                multiline
                hasError={!!shouldShowTextError}
                minHeight={220}
                value={memoForm.values.text}
                onBlur={() => memoForm.setTouched('text')}
                onChangeText={(text) => memoForm.setValue('text', text)}
                onFocus={() => memoForm.clearError('text')}
              />
            </Form.Field>

            <Form.Field error={selectedCategoryError} label="카테고리">
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
                      borderStyle="dashed"
                      size="sm"
                      variant="ghost"
                      onPress={() => setShowAddCategory(true)}
                    >
                      + 추가
                    </Button>
                  )}
                </XStack>
              </ScrollView>

              {showAddCategory && (
                <XStack alignItems="center" gap="$1" marginTop="$2">
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
                  <XStack alignItems="center" gap="$1">
                    <Button
                      disabled={!categoryForm.isValid || createCategoryMutation.isPending}
                      minWidth={60}
                      size="md"
                      variant="primary"
                      onPress={handleAddCategory}
                    >
                      추가
                    </Button>
                    <Button
                      minWidth={60}
                      size="md"
                      variant="ghost"
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
        </ScrollView>
      </YStack>

      <SubmitButton
        isLoading={createMemoMutation.isPending}
        loadingText="등록중..."
        onPress={memoForm.handleSubmit}
      >
        등록
      </SubmitButton>
    </>
  );
};
