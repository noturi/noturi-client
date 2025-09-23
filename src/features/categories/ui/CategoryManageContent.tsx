import { ScrollView, XStack, YStack } from 'tamagui';
import { z } from 'zod';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '~/features/categories/api/mutations';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { useForm } from '~/shared/lib/useForm';
import { Button, Form, Input, SubmitButton, Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Alert } from 'react-native';

import { X } from '@tamagui/lucide-icons';

import { useQuery } from '@tanstack/react-query';

import { handleCategoryFormError } from '../lib/form-error-handler';

interface CategoryManageContentProps {
  keyboardHeight: number;
  shouldAutoFocus?: boolean;
  onSuccess?: () => void;
}

export const CategoryManageContent = ({
  keyboardHeight,
  shouldAutoFocus = false,
  onSuccess,
}: CategoryManageContentProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const textInputRef = useRef<TextInput | null>(null);

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const form = useForm({
    initialValues: {
      categoryName: '',
      categoryDeleteError: '',
    },
    validationSchema: z.object({
      categoryName: z.string().min(1, '카테고리 이름을 입력해주세요.'),
      categoryDeleteError: z.string().optional(),
    }),
    onSubmit: async (values) => {
      createCategoryMutation.mutate({
        name: values.categoryName.trim(),
        color: '#de07ff', // 기본 색상
      });
    },
  });

  // 자동 포커스 (shouldAutoFocus가 true일 때만)
  useEffect(() => {
    if (!shouldAutoFocus || !isFormVisible) return;

    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [shouldAutoFocus, isFormVisible]);

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: () => {
      form.reset();
      setIsFormVisible(false);
      onSuccess?.();
    },
    onError: (error) => {
      handleCategoryFormError(error, form);
    },
  });

  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleAddCategory = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleCancelAdd = () => {
    form.reset();
    setIsFormVisible(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      Alert.alert('삭제 불가', '마지막 카테고리는 삭제할 수 없습니다.', [
        { text: '확인', style: 'default' },
      ]);
      return;
    }

    deleteCategoryMutation.mutate(categoryId);
  };

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
            {/* 카테고리 추가 버튼 */}
            {!isFormVisible && (
              <Form.Field>
                <Button size="md" variant="ghost" onPress={handleAddCategory}>
                  + 새 카테고리 추가
                </Button>
              </Form.Field>
            )}

            {/* 카테고리 추가 폼 */}
            {isFormVisible && (
              <Form.Field
                required
                error={form.shouldShowError('categoryName') ? form.errors.categoryName : undefined}
                label="새 카테고리"
              >
                <XStack gap="$2">
                  <YStack flex={1}>
                    <Input
                      ref={textInputRef}
                      hasError={!!form.shouldShowError('categoryName')}
                      maxLength={20}
                      placeholder="카테고리 이름을 입력하세요"
                      value={form.values.categoryName}
                      onBlur={() => form.setTouched('categoryName')}
                      onChangeText={(text) => form.setValue('categoryName', text)}
                      onFocus={() => form.clearError('categoryName')}
                    />
                  </YStack>
                  <XStack alignItems="center" gap="$1">
                    <Button minWidth={60} size="md" variant="primary" onPress={form.handleSubmit}>
                      추가
                    </Button>
                    <Button minWidth={60} size="md" variant="ghost" onPress={handleCancelAdd}>
                      취소
                    </Button>
                  </XStack>
                </XStack>
              </Form.Field>
            )}

            {/* 삭제 에러 표시 */}
            {form.errors.categoryDeleteError && (
              <Form.Field>
                <Typography color="$error" variant="caption2">
                  {form.errors.categoryDeleteError.message}
                </Typography>
              </Form.Field>
            )}

            {/* 기존 카테고리 목록 */}
            <Form.Field label="기존 카테고리">
              <XStack gap="$2">
                {categories.map((category) => (
                  <XStack
                    key={category.id}
                    alignItems="center"
                    backgroundColor="$backgroundPrimary"
                    borderColor="$border"
                    borderRadius="$8"
                    borderWidth={1}
                    justifyContent="space-between"
                    padding="$3"
                  >
                    <Typography variant="callout">{category.name}</Typography>
                    <XStack
                      disabled={categories.length <= 1 || deleteCategoryMutation.isPending}
                      onPress={() => handleDeleteCategory(category.id)}
                    >
                      <X color="$error" size="$3" />
                    </XStack>
                  </XStack>
                ))}
              </XStack>
            </Form.Field>
          </Form>
        </ScrollView>
      </YStack>

      {isFormVisible && (
        <SubmitButton
          isLoading={createCategoryMutation.isPending}
          keyboardHeight={keyboardHeight}
          loadingText="추가 중..."
          onPress={form.handleSubmit}
        >
          카테고리 추가
        </SubmitButton>
      )}
    </>
  );
};
