import { ScrollView, XStack, YStack } from 'tamagui';
import { z } from 'zod';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '~/features/categories/api/mutations';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { useForm } from '~/shared/lib';
import { Button, Form, Input, Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Alert, Pressable } from 'react-native';

import { X } from '@tamagui/lucide-icons';

import { useQuery } from '@tanstack/react-query';

import { handleCategoryFormError } from '../model/form-error-handler';

interface CategoryManageContentProps {
  shouldAutoFocus?: boolean;
  onSuccess?: () => void;
}

export const CategoryManageContent = ({
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
        color: '#07ff9c',
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
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Form>
            <Form.Field>
              {!isFormVisible && (
                <Button borderStyle="dashed" size="$2" variant="ghost" onPress={handleAddCategory}>
                  + 추가
                </Button>
              )}

              {isFormVisible && (
                <XStack alignItems="center" gap="$1" marginTop="$2">
                  <YStack flex={1}>
                    <Form.Field
                      error={
                        form.shouldShowError('categoryName') ? form.errors.categoryName : undefined
                      }
                    >
                      <Input
                        ref={textInputRef}
                        hasError={!!form.shouldShowError('categoryName')}
                        maxLength={20}
                        placeholder="새 카테고리 이름"
                        value={form.values.categoryName}
                        onBlur={() => form.setTouched('categoryName')}
                        onChangeText={(text) => form.setValue('categoryName', text)}
                        onFocus={() => form.clearError('categoryName')}
                      />
                    </Form.Field>
                  </YStack>
                  <XStack alignItems="center" gap="$1">
                    <Button
                      disabled={!form.isValid || createCategoryMutation.isPending}
                      size="$2"
                      variant="primary"
                      onPress={form.handleSubmit}
                    >
                      추가
                    </Button>
                    <Button size="$2" variant="ghost" onPress={handleCancelAdd}>
                      취소
                    </Button>
                  </XStack>
                </XStack>
              )}
            </Form.Field>

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
              <XStack flexWrap="wrap" gap="$3">
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    disabled={categories.length <= 1 || deleteCategoryMutation.isPending}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                      opacity: pressed ? 0.95 : 1,
                    })}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <XStack
                      alignItems="center"
                      backgroundColor="$surface"
                      borderColor="$border"
                      borderRadius="$4"
                      borderWidth={1}
                      gap="$2"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                    >
                      <Typography variant="caption1">{category.name}</Typography>
                      <X color="$error" size="$2" />
                    </XStack>
                  </Pressable>
                ))}
              </XStack>
            </Form.Field>
          </Form>
        </ScrollView>
      </YStack>
    </>
  );
};
