import { Sheet, XStack, YStack } from 'tamagui';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '~/features/categories/api/mutations';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { useForm } from '~/shared/lib/useForm';
import { Button, Form, Input, Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

import { X } from '@tamagui/lucide-icons';

import { useQuery } from '@tanstack/react-query';

import { handleCategoryFormError } from '../lib/form-error-handler';

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const textAreaRef = useRef<TextInput | null>(null);

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: () => {
      form.reset();
      setIsFormVisible(false);
    },
    onError: (error) => {
      handleCategoryFormError(error, form);
    },
  });
  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      form.clearError('categoryDeleteError');
    },
    onError: (error) => {
      handleCategoryFormError(error, form);
    },
  });

  const form = useForm({
    initialValues: {
      categoryName: '',
      categoryDeleteError: '', // 카테고리 삭제 에러 전용 필드
    },
    onSubmit: async (values) => {
      await createCategoryMutation.mutateAsync({
        name: values.categoryName.trim(),
        color: '#1d1d1d',
      });
    },
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e) => {
      const height = Platform.OS === 'ios' ? e.endCoordinates.height : e.endCoordinates.height + 20;
      setKeyboardHeight(height);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={keyboardHeight > 0 ? [70] : [50]}
      snapPointsMode="percent"
      onOpenChange={onClose}
    >
      <Sheet.Overlay
        animation="quick"
        backgroundColor="$backgroundOverlay"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$2xl"
        borderTopRightRadius="$2xl"
      >
        {/* Handle */}
        <YStack alignItems="center" paddingBottom="$sm" paddingTop="$sm">
          <YStack backgroundColor="$textMuted" borderRadius="$sm" height={4} width={36} />
        </YStack>

        {/* Header */}
        <XStack
          alignItems="center"
          borderBottomColor="$border"
          borderBottomWidth={1}
          paddingHorizontal="$sm"
          paddingVertical="$md"
          position="relative"
        >
          <XStack
            backgroundColor="$backgroundTransparent"
            borderRadius="$lg"
            paddingHorizontal="$md"
            paddingVertical="$sm"
            pressStyle={{ opacity: 0.7 }}
            onPress={onClose}
          >
            <X color="$textSecondary" size="$lg" />
          </XStack>
          <Typography
            left={0}
            position="absolute"
            right={0}
            textAlign="center"
            variant="subheading"
          >
            카테고리 관리
          </Typography>
        </XStack>

        {/* Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <YStack flex={1} padding="$xl" onStartShouldSetResponder={() => true}>
            <YStack gap="$2xl">
              <XStack alignItems="center" justifyContent="space-between">
                <Typography variant="title">카테고리</Typography>
                <XStack alignItems="center" minHeight={36}>
                  {!isFormVisible && (
                    <Button
                      size="md"
                      onPress={() => {
                        setIsFormVisible(true);
                        setTimeout(() => {
                          textAreaRef.current?.focus();
                        }, 100);
                      }}
                    >
                      + 추가
                    </Button>
                  )}
                </XStack>
              </XStack>

              <Form>
                {isFormVisible && (
                  <Form.Field label="카테고리 이름">
                    <XStack alignItems="center" gap="$sm">
                      <Input
                        ref={textAreaRef}
                        flex={1}
                        maxLength={20}
                        placeholder="새 카테고리 이름"
                        value={form.values.categoryName}
                        onBlur={() => form.setTouched('categoryName')}
                        onChangeText={(text) => form.setValue('categoryName', text)}
                      />
                      <Button
                        disabled={!form.values.categoryName.trim() || form.isSubmitting}
                        size="md"
                        onPress={form.handleSubmit}
                      >
                        + 추가
                      </Button>
                      <Button
                        variant="ghost"
                        onPress={() => {
                          setIsFormVisible(false);
                          form.reset();
                        }}
                      >
                        취소
                      </Button>
                    </XStack>
                  </Form.Field>
                )}

                {form.shouldShowError('categoryName') && (
                  <Form.Error>{form.errors.categoryName?.message}</Form.Error>
                )}

                {form.shouldShowError('categoryDeleteError') && (
                  <Form.Error>{form.errors.categoryDeleteError?.message}</Form.Error>
                )}

                <XStack flexWrap="wrap" gap="$md">
                  {categories.map((category) => (
                    <XStack
                      key={category.id}
                      alignItems="center"
                      backgroundColor="$surface"
                      borderColor="$border"
                      borderRadius="$2xl"
                      borderWidth={1}
                      flexShrink={0}
                      gap="$md"
                      paddingHorizontal="$md"
                      paddingVertical="$md"
                      pressStyle={{ backgroundColor: '$surfaceHover' }}
                      onPress={() => handleDeleteCategory(category.id)}
                    >
                      <Typography color="$textSecondary" flexShrink={0} variant="caption1">
                        {category.name}
                      </Typography>
                      <X color="$textPrimary" size="$md" />
                    </XStack>
                  ))}
                </XStack>
              </Form>
            </YStack>
          </YStack>
        </KeyboardAvoidingView>
      </Sheet.Frame>
    </Sheet>
  );
};
