import { Button, Input, Sheet, Spinner, XStack, YStack } from 'tamagui';
import { useCreateCategoryMutation } from '~/features/categories/api/mutations';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Alert } from 'react-native';

import { X } from '@tamagui/lucide-icons';

interface CategoryAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoryName: string) => void;
}

export const CategoryAddSheet = ({ isOpen, onClose, onSuccess }: CategoryAddSheetProps) => {
  const [categoryName, setCategoryName] = useState('');

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      setCategoryName('');
      onSuccess?.(newCategory.name);
      onClose();
      Alert.alert('성공', '새 카테고리가 생성되었습니다.');
    },
  });

  const handleCreate = () => {
    if (!categoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요.');
      return;
    }

    createCategoryMutation.mutate({
      name: categoryName.trim(),
      color: '$primary',
    });
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={[40]}
      snapPointsMode="percent"
      onOpenChange={handleClose}
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
        {/* Header */}
        <XStack
          alignItems="center"
          borderBottomColor="$border"
          borderBottomWidth={1}
          justifyContent="space-between"
          paddingHorizontal="$xl"
          paddingVertical="$lg"
        >
          <Typography variant="title">새 카테고리 추가</Typography>
          <Button
            backgroundColor="$backgroundTransparent"
            color="$textSecondary"
            onPress={handleClose}
          >
            취소
          </Button>
        </XStack>

        {/* Content */}
        <YStack gap="$lg" padding="$xl">
          <YStack gap="$sm">
            <Typography variant="subtitle">카테고리 이름</Typography>
            <Input
              backgroundColor="$backgroundPrimary"
              borderColor="$border"
              borderRadius="$lg"
              borderWidth={1}
              color="$textPrimary"
              fontSize="$md"
              maxLength={20}
              paddingHorizontal="$lg"
              paddingVertical="$md"
              placeholder="카테고리 이름을 입력하세요"
              placeholderTextColor="$textMuted"
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </YStack>

          <XStack gap="$md" marginTop="$sm">
            <Button
              backgroundColor="$surface"
              borderColor="$border"
              borderWidth={1}
              color="$textSecondary"
              flex={1}
              icon={<X size="$md" />}
              onPress={handleClose}
            />
            <Button
              backgroundColor="$accent"
              color="$textOnAccent"
              disabled={!categoryName.trim() || createCategoryMutation.isPending}
              flex={1}
              icon={
                createCategoryMutation.isPending ? (
                  <Spinner color="$textOnAccent" size="small" />
                ) : undefined
              }
              onPress={handleCreate}
            >
              {createCategoryMutation.isPending ? '생성 중...' : '생성'}
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
