import { CategoryButton, activeCategoriesQuery } from '~/entities/category';
import { useGradualAnimation } from '~/shared/lib';
import { Button, FloatingButton, Form, Loading, TextArea } from '~/shared/ui';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useQuery } from '@tanstack/react-query';

import { useMemoForm } from '../model';
import { RatingSelector } from './rating-selector';

export interface AddCategorySlotProps {
  onCreated: (category: { name: string }) => void;
  onCancel: () => void;
}

interface MemoFormProps {
  /** 있으면 수정 모드, 없으면 생성 모드 */
  memoId?: string;
  onSuccess?: () => void;
  shouldAutoFocus?: boolean;
  /**
   * 카테고리 추가 UI 슬롯. 카테고리 생성은 categories feature 소관이므로
   * MemoForm은 구현을 모르고 상위(pages)에서 주입받는다. 없으면 "+ 추가" 버튼을 숨긴다.
   */
  renderAddCategory?: (props: AddCategorySlotProps) => ReactNode;
}

export const MemoForm = ({
  memoId,
  onSuccess,
  shouldAutoFocus = false,
  renderAddCategory,
}: MemoFormProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const titleInputRef = useRef<TextInput>(null);
  const { height } = useGradualAnimation();

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const {
    form: memoForm,
    isEdit,
    isLoadingMemo,
    isSubmitting,
  } = useMemoForm({
    memoId,
    categories,
    onSuccess,
  });

  const handleCategorySelect = (categoryName: string) => {
    memoForm.setValue('selectedCategory', categoryName);
  };

  const handleCategoryCreated = (category: { name: string }) => {
    handleCategorySelect(category.name);
    setShowAddCategory(false);
  };

  // 생성 모드: 지연 포커스 (바텀시트 애니메이션 후)
  useEffect(() => {
    if (!shouldAutoFocus) return;

    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [shouldAutoFocus]);

  const shouldShowTextError = memoForm.shouldShowError('text');
  const textError = shouldShowTextError ? memoForm.errors.text : undefined;
  const selectedCategoryError = memoForm.shouldShowError('selectedCategory')
    ? memoForm.errors.selectedCategory
    : undefined;

  const floatingButtonPosition = useAnimatedStyle(() => {
    return {
      bottom: height.get() > 42 ? height.get() + 10 : 140,
    };
  }, []);

  if (isLoadingMemo) {
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
                ref={titleInputRef}
                multiline
                autoFocus={isEdit}
                hasError={!!shouldShowTextError}
                minHeight={220}
                placeholder="첫 번째 줄은 제목, 나머지는 내용이 됩니다"
                value={memoForm.values.text}
                onBlur={() => memoForm.setTouched('text')}
                onChangeText={(text) => memoForm.setValue('text', text)}
                onFocus={() => memoForm.clearError('text')}
              />
            </Form.Field>

            <Form.Field error={selectedCategoryError} label="카테고리">
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
                  {renderAddCategory && !showAddCategory && (
                    <Button size="sm" variant="ghost" onPress={() => setShowAddCategory(true)}>
                      <Button.Label>+ 추가</Button.Label>
                    </Button>
                  )}
                </View>
              </ScrollView>

              {showAddCategory &&
                renderAddCategory?.({
                  onCreated: handleCategoryCreated,
                  onCancel: () => setShowAddCategory(false),
                })}
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
          isLoading={isSubmitting}
          onPress={memoForm.handleSubmit}
        />
      </Animated.View>
    </>
  );
};
