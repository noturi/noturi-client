import { CategoryButton } from '~/entities/category/ui';
import { memoDetailQuery } from '~/entities/memo/api';
import type { CategoryFormData, MemoFormData } from '~/entities/memo/model/schemas';
import { categoryFormSchema, memoFormSchema } from '~/entities/memo/model/schemas';
import { activeCategoriesQuery, useCreateCategoryMutation } from '~/features/categories/api';
import { DEFAULT_COLORS } from '~/shared/config';
import { useForm, useGradualAnimation, useToast } from '~/shared/lib';
import { MESSAGES } from '~/shared/model';
import { Button, FloatingButton, Form, Input, Loading, TextArea } from '~/shared/ui';

import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useQuery } from '@tanstack/react-query';

import { useUpdateMemoMutation } from '../api';
import { RatingSelector } from './rating-selector';

interface MemoEditFormProps {
  memoId: string;
  onSuccess?: () => void;
}

export const MemoEditForm = ({ memoId, onSuccess }: MemoEditFormProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const toast = useToast();
  const { height } = useGradualAnimation();

  const { data: memo, isLoading } = useQuery(memoDetailQuery(memoId));
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
      const lines = values.text.split('\n');
      let title = lines[0].trim() || '제목 없음';
      let content = lines.slice(1).join('\n').trim();

      if (title.length > 30) {
        const truncatedTitle = title.substring(0, 30);
        const remainingText = title.substring(30);
        title = truncatedTitle;
        content = remainingText + (content ? '\n' + content : '');
      }

      const selectedCat = values.selectedCategory
        ? categories.find((cat) => cat.name === values.selectedCategory)
        : null;

      const memoData: any = {
        id: memoId,
        title,
        content: content || '',
      };

      if (selectedCat?.id) {
        memoData.categoryId = selectedCat.id;
      }

      if (values.rating > 0) {
        memoData.rating = values.rating;
      }

      updateMemoMutation.mutate(memoData);
    },
  });

  const categoryForm = useForm<CategoryFormData>({
    initialValues: { name: '' },
    validationSchema: categoryFormSchema,
  });

  useEffect(() => {
    if (memo) {
      const text = memo.content ? `${memo.title}\n${memo.content}` : memo.title;
      memoForm.setValue('text', text);
      memoForm.setValue('rating', Number(memo.rating) || 0);
      memoForm.setValue('selectedCategory', memo.category?.name || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memo]);

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

  const shouldShowTextError = memoForm.shouldShowError('text');
  const textError = shouldShowTextError ? memoForm.errors.text : undefined;

  const floatingButtonPosition = useAnimatedStyle(() => {
    return {
      bottom: height.value > 42 ? height.value + 10 : 140,
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-bg-primary">
        <Loading text="메모를 불러오는 중..." />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 p-4" onStartShouldSetResponder={() => true}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Form>
            <Form.Field required error={textError} label="메모">
              <TextArea
                autoFocus
                multiline
                hasError={!!shouldShowTextError}
                minHeight={220}
                placeholder="첫 번째 줄은 제목, 나머지는 내용이 됩니다"
                value={memoForm.values.text}
                onBlur={() => memoForm.setTouched('text')}
                onChangeText={(text) => memoForm.setValue('text', text)}
                onFocus={() => memoForm.clearError('text')}
              />
            </Form.Field>

            <Form.Field
              error={
                memoForm.shouldShowError('selectedCategory')
                  ? memoForm.errors.selectedCategory
                  : undefined
              }
              label="카테고리"
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
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
                </View>
              </ScrollView>

              {showAddCategory && (
                <View className="mt-2 flex-row items-center gap-1">
                  <View className="flex-1">
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
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Button
                      disabled={!categoryForm.isValid || createCategoryMutation.isPending}
                      size="sm"
                      onPress={handleAddCategory}
                    >
                      추가
                    </Button>
                    <Button size="sm" onPress={handleCancelAddCategory}>
                      취소
                    </Button>
                  </View>
                </View>
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
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            position: 'absolute',
            right: 16,
          },
          floatingButtonPosition,
        ]}
      >
        <FloatingButton
          disabled={!memoForm.isValid}
          isLoading={updateMemoMutation.isPending}
          onPress={memoForm.handleSubmit}
        />
      </Animated.View>
    </>
  );
};
