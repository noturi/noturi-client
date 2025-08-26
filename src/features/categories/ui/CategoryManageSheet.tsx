import { Button, Sheet, TextArea, XStack, YStack } from 'tamagui';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '~/features/categories/api/mutations';
import { activeCategoriesQuery } from '~/features/categories/api/queries';
import { Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

import { X } from '@tamagui/lucide-icons';

import { useQuery } from '@tanstack/react-query';

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const textAreaRef = useRef<TextInput | null>(null);

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: () => {
      setNewCategoryName('');
    },
  });
  const deleteCategoryMutation = useDeleteCategoryMutation();

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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요.');
      return;
    }
    createCategoryMutation.mutate({ name: newCategoryName.trim(), color: '#000000' });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert('삭제', `카테고리 "${name}" 을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteCategoryMutation.mutate(id),
      },
    ]);
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
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        {/* Handle */}
        <YStack alignItems="center" paddingBottom="$1" paddingTop="$2">
          <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
        </YStack>

        {/* Header */}
        <XStack
          alignItems="center"
          borderBottomColor="$border"
          borderBottomWidth={1}
          paddingHorizontal="$2"
          paddingVertical="$3"
          position="relative"
        >
          <Button
            backgroundColor="$backgroundTransparent"
            borderRadius="$4"
            borderWidth={0}
            color="$textSecondary"
            pressStyle={{ backgroundColor: '$backgroundTransparent' }}
            size="$3"
            onPress={onClose}
          >
            취소
          </Button>
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
          <YStack flex={1} padding="$4" onStartShouldSetResponder={() => true}>
            <YStack gap="$2">
              <XStack alignItems="center" justifyContent="space-between">
                <Typography variant="title">카테고리</Typography>
                {!newCategoryName && (
                  <Button
                    backgroundColor="$surface"
                    borderRadius="$7"
                    borderWidth={0}
                    color="$textSecondary"
                    fontSize="$3"
                    minHeight={36}
                    minWidth={60}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    pressStyle={{ backgroundColor: '$surfaceHover' }}
                    onPress={() => {
                      setNewCategoryName(' ');
                      setTimeout(() => {
                        textAreaRef.current?.focus();
                      }, 100);
                    }}
                  >
                    + 추가
                  </Button>
                )}
              </XStack>

              {newCategoryName && (
                <XStack alignItems="center" gap="$4" marginTop="$2">
                  <TextArea
                    ref={textAreaRef}
                    backgroundColor="$backgroundSecondary"
                    borderRadius="$6"
                    borderWidth={0}
                    color="$textPrimary"
                    flex={1}
                    fontSize="$4"
                    maxHeight={48}
                    maxLength={20}
                    multiline={false}
                    padding="$3"
                    placeholder="새 카테고리 이름"
                    placeholderTextColor="$textMuted"
                    value={newCategoryName.trim()}
                    onChangeText={setNewCategoryName}
                  />
                  <XStack alignItems="center" gap="$2">
                    <Button
                      backgroundColor="$textPrimary"
                      borderRadius="$6"
                      color="$textOnPrimary"
                      disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
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
                      onPress={() => setNewCategoryName('')}
                    >
                      취소
                    </Button>
                  </XStack>
                </XStack>
              )}

              <XStack flexWrap="wrap" gap="$2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    backgroundColor="$surface"
                    borderColor="$border"
                    borderRadius="$7"
                    borderWidth={1}
                    minHeight={36}
                    minWidth={60}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    pressStyle={{ backgroundColor: '$surfaceHover' }}
                    onPress={() => handleDeleteCategory(category.id, category.name)}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Typography color="$textSecondary" variant="subtitle">
                        {category.name}
                      </Typography>
                      <X color="$textPrimary" size={12} />
                    </XStack>
                  </Button>
                ))}
              </XStack>
            </YStack>
          </YStack>
        </KeyboardAvoidingView>
      </Sheet.Frame>
    </Sheet>
  );
};
