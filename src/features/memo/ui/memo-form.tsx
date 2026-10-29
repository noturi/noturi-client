import { CategoryButton, activeCategoriesQuery } from '~/entities/category';
import { useGradualAnimation, useScreenTransitionEnd } from '~/shared/lib';
import { FloatingButton, Form, Loading, TextArea, Typography } from '~/shared/ui';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, type TextInputInstance, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useQuery } from '@tanstack/react-query';

import { useMemoForm } from '../model';
import { RatingSelector } from './rating-selector';

const BORDERLESS_TEXT_AREA = {
  borderWidth: 0,
  backgroundColor: 'transparent',
  paddingHorizontal: 0,
  // iOS 여러 줄 입력의 기본 글자 안쪽 여백(약 5pt)만큼 당겨 칩·별점과 같은 왼쪽 줄에 맞춤
  marginLeft: -5,
  fontSize: 15,
  lineHeight: 22,
} as const;

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
  const inputRef = useRef<TextInputInstance>(null);
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

  // 화면이 다 들어온 뒤 포커스 — 전환 중에 포커스하면 키보드가 화면과 함께 옆에서 밀려 들어옴
  const isTransitionDone = useScreenTransitionEnd();
  const shouldFocus = (shouldAutoFocus || isEdit) && !isLoadingMemo;
  useEffect(() => {
    if (isTransitionDone && shouldFocus) inputRef.current?.focus();
  }, [isTransitionDone, shouldFocus]);

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
          {/* 순서: 가장 먼저 정하는 별점 → 카테고리 → 메모 (키보드가 올라와도 별점이 가리지 않게 위쪽) */}
          <Form className="gap-5 pt-2">
            {/* 메모 정보(별점·카테고리)는 한 묶음으로 붙이고, 구분선 아래가 본문 */}
            <View className="gap-4">
              <View className="py-1">
                <RatingSelector
                  rating={Number(memoForm.values.rating)}
                  onRatingChange={(rating) => memoForm.setValue('rating', Number(rating))}
                />
              </View>

              <Form.Field error={selectedCategoryError}>
                <ScrollView
                  horizontal
                  keyboardShouldPersistTaps="handled"
                  showsHorizontalScrollIndicator={false}
                >
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
                      // 카테고리 칩(CategoryButton)과 같은 크기·모양 — 테두리만 점선으로 "추가"임을 구분
                      <Pressable
                        className="justify-center rounded-4 border border-dashed border-border px-3 py-2 active:opacity-70"
                        hitSlop={2}
                        onPress={() => setShowAddCategory(true)}
                      >
                        <Typography className="text-text-secondary" variant="caption1">
                          + 추가
                        </Typography>
                      </Pressable>
                    )}
                  </View>
                </ScrollView>

                {showAddCategory &&
                  renderAddCategory?.({
                    onCreated: handleCategoryCreated,
                    onCancel: () => setShowAddCategory(false),
                  })}
              </Form.Field>
            </View>

            <View className="h-px bg-border" />

            <Form.Field error={textError}>
              <TextArea
                ref={inputRef}
                multiline
                hasError={!!shouldShowTextError}
                minHeight={220}
                placeholder="제목"
                // 박스 없이 화면에 바로 쓰는 메모 앱 느낌 — 홈의 카드 없는 목록과 맞춤
                style={BORDERLESS_TEXT_AREA}
                value={memoForm.values.text}
                onBlur={() => memoForm.setTouched('text')}
                onChangeText={(text) => memoForm.setValue('text', text)}
                onFocus={() => memoForm.clearError('text')}
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
          icon="check"
          isLoading={isSubmitting}
          onPress={memoForm.handleSubmit}
        />
      </Animated.View>
    </>
  );
};
