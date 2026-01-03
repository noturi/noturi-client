import { z } from 'zod';
import type { Category } from '~/entities/category';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { useForm } from '~/shared/lib';
import { GripVertical } from '~/shared/lib/icons';
import { Button, Form, Input } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { TextInput } from 'react-native';

import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery } from '@tanstack/react-query';

import { useReorderCategoriesMutation } from '../api/mutations';
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

  const reorderMutation = useReorderCategoriesMutation();

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

  const handleCreateError = async (error: Error) => {
    await handleCategoryFormError(error, form);
  };

  const handleDragEnd = ({ data }: { data: Category[] }) => {
    const reorderData = {
      categories: data.map((cat, index) => ({
        id: cat.id,
        sortOrder: index,
      })),
    };
    reorderMutation.mutate(reorderData);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Category>) => (
    <ScaleDecorator>
      <Pressable
        className={`flex-row items-center gap-2 py-2 ${isActive ? 'opacity-80' : ''}`}
        disabled={isActive}
        onLongPress={drag}
      >
        <GripVertical className="text-text-muted" size={16} />
        <CategoryDeleteButton
          categoryId={item.id}
          categoryName={item.name}
          disabled={categories.length <= 1}
        />
      </Pressable>
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 p-4" onStartShouldSetResponder={() => true}>
        <Form>
          <Form.Field>
            {!isFormVisible && (
              <Button size="md" variant="ghost" onPress={handleShowForm}>
                <Button.Label>+ 추가</Button.Label>
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
                    <Button.Label>취소</Button.Label>
                  </Button>
                </View>
              </View>
            )}
          </Form.Field>

          <Form.Field label="카테고리 (길게 눌러서 순서 변경)">
            <View style={{ maxHeight: 300 }}>
              <DraggableFlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator
                onDragEnd={handleDragEnd}
              />
            </View>
          </Form.Field>
        </Form>
      </View>
    </GestureHandlerRootView>
  );
};
