import { z } from 'zod';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { useForm } from '~/shared/lib';
import { Button, Form, Input } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { TextInput } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { handleCategoryFormError } from '../model/form-error-handler';
import { CategoryCreateButton } from './category-create-button';
import { CategoryDeleteButton } from './category-delete-button';

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
    },
    validationSchema: z.object({
      categoryName: z.string().min(1, '카테고리 이름을 입력해주세요.'),
    }),
  });

  useEffect(() => {
    if (!shouldAutoFocus || !isFormVisible) return;

    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [shouldAutoFocus, isFormVisible]);

  const handleShowForm = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleCancelAdd = () => {
    form.reset();
    setIsFormVisible(false);
  };

  const handleCreateSuccess = () => {
    form.reset();
    setIsFormVisible(false);
    onSuccess?.();
  };

  const handleCreateError = (error: Error) => {
    handleCategoryFormError(error, form);
  };

  return (
    <View className="flex-1 p-4" onStartShouldSetResponder={() => true}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Form>
          <Form.Field>
            {!isFormVisible && (
              <Button borderStyle="dashed" size="md" variant="ghost" onPress={handleShowForm}>
                + 추가
              </Button>
            )}

            {isFormVisible && (
              <View className="mt-2 flex-row items-center gap-1">
                <View className="flex-1">
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
                </View>
                <View className="flex-row items-center gap-1">
                  <CategoryCreateButton
                    isValid={form.isValid}
                    name={form.values.categoryName}
                    onError={handleCreateError}
                    onSuccess={handleCreateSuccess}
                  />
                  <Button size="sm" variant="ghost" onPress={handleCancelAdd}>
                    취소
                  </Button>
                </View>
              </View>
            )}
          </Form.Field>

          <Form.Field label="기존 카테고리">
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <CategoryDeleteButton
                  key={category.id}
                  categoryId={category.id}
                  categoryName={category.name}
                  disabled={categories.length <= 1}
                />
              ))}
            </View>
          </Form.Field>
        </Form>
      </ScrollView>
    </View>
  );
};
