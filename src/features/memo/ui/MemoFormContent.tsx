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
      title: '',
      memoContent: '',
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

      createMemoMutation.mutate({
        title: values.title,
        content: values.memoContent,
        categoryId: selectedCat.id,
        rating: values.rating,
      });
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
      memoForm.setError('title', { message: '메모 등록 중 오류가 발생했습니다.', type: 'server' });
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

  const shouldShowTitleError =
    memoForm.errors.title && memoForm.values.title.length === 0 && memoForm.touched.title;
  const titleError = shouldShowTitleError ? memoForm.errors.title : undefined;

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
            <Form.Field required error={titleError} label="제목">
              <Input
                ref={titleInputRef}
                hasError={!!shouldShowTitleError}
                placeholder="제목을 입력하세요"
                value={memoForm.values.title}
                onBlur={() => memoForm.setTouched('title')}
                onChangeText={(text) => memoForm.setValue('title', text)}
                onFocus={() => memoForm.clearError('title')}
              />
            </Form.Field>

            <Form.Field
              required
              error={
                memoForm.shouldShowError('memoContent') ? memoForm.errors.memoContent : undefined
              }
              label="내용"
            >
              <TextArea
                multiline
                hasError={!!memoForm.shouldShowError('memoContent')}
                placeholder="내용을 입력하세요"
                value={memoForm.values.memoContent}
                onBlur={() => memoForm.setTouched('memoContent')}
                onChangeText={(text) => memoForm.setValue('memoContent', text)}
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
                      borderStyle="dashed"
                      minWidth={60}
                      size="md"
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
                rating={memoForm.values.rating}
                onRatingChange={(rating) => memoForm.setValue('rating', rating)}
              />
            </Form.Field>
          </Form>
        </ScrollView>
      </YStack>

      <SubmitButton
        isLoading={createMemoMutation.isPending}
        keyboardHeight={keyboardHeight}
        loadingText="등록중..."
        onPress={memoForm.handleSubmit}
      >
        등록
      </SubmitButton>
    </>
  );
};
