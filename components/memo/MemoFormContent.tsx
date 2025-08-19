import { Button, ScrollView, XStack, YStack } from 'tamagui';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { CategoryButton } from '@/components/category';
import { Form, Input, TextArea } from '@/components/ui';
import { DEFAULT_COLORS } from '@/constants/colors';
import { MESSAGES } from '@/constants/messages';
import { useForm, useToast } from '@/hooks';
import type { CategoryFormData, MemoFormData } from '@/lib/memo/schemas';
import { categoryFormSchema, memoFormSchema } from '@/lib/memo/schemas';
import { activeCategoriesQuery, useCreateCategoryMutation } from '@/services/category';
import { useCreateMemoMutation } from '@/services/memo';

import { RatingSelector } from './RatingSelector';

interface MemoFormContentProps {
  keyboardHeight: number;
  onSuccess?: () => void;
}

export const MemoFormContent = ({ keyboardHeight, onSuccess }: MemoFormContentProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
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
    onError: (error) => {
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
    onError: (error) => {
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

  return (
    <>
      <YStack flex={1} onStartShouldSetResponder={() => true}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Form>
            <Form.Field
              required
              error={memoForm.shouldShowError('title') ? memoForm.errors.title : undefined}
              label="제목"
            >
              <Input
                hasError={!!memoForm.shouldShowError('title')}
                placeholder="제목을 입력하세요"
                value={memoForm.values.title}
                onBlur={() => memoForm.setTouched('title')}
                onChangeText={(text) => memoForm.setValue('title', text)}
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
                placeholder="무엇을 기록하고 싶나요?"
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
                <XStack alignItems="center" gap="$4" marginTop="$3">
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

      <Button
        animation="quick"
        borderRadius="$6"
        bottom={keyboardHeight > 0 ? keyboardHeight + 50 : 30}
        disabled={createMemoMutation.isPending}
        position="absolute"
        right={20}
        size="$5"
        onPress={memoForm.handleSubmit}
      >
        {createMemoMutation.isPending ? '등록중...' : '등록'}
      </Button>
    </>
  );
};
