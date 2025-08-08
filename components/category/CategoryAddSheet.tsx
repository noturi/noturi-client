import { Button, Input, Sheet, Spinner, XStack, YStack } from 'tamagui';

import { useState } from 'react';
import { Alert } from 'react-native';

import { X } from '@tamagui/lucide-icons';

import { Typography } from '@/components/ui';
import { useCreateCategoryMutation } from '@/services/category';

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
    onError: (error: any) => {
      Alert.alert('오류', error.message || '카테고리 생성에 실패했습니다.');
    },
  });

  const handleCreate = () => {
    if (!categoryName.trim()) {
      Alert.alert('알림', '카테고리 이름을 입력해주세요.');
      return;
    }

    createCategoryMutation.mutate({
      name: categoryName.trim(),
      color: '#000000', // 기본 검정색
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
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$0"
      >
        {/* Header */}
        <XStack
          alignItems="center"
          borderBottomColor="$border"
          borderBottomWidth={1}
          justifyContent="space-between"
          paddingHorizontal="$5"
          paddingVertical="$4"
        >
          <Typography variant="title">새 카테고리 추가</Typography>
          <Button chromeless circular icon={<X size={20} />} size="$3" onPress={handleClose} />
        </XStack>

        {/* Content */}
        <YStack gap="$4" padding="$5">
          <YStack gap="$2">
            <Typography variant="subtitle">카테고리 이름</Typography>
            <Input
              backgroundColor="$backgroundPrimary"
              borderColor="$border"
              borderRadius="$4"
              borderWidth={1}
              color="$textPrimary"
              fontSize="$4"
              maxLength={20}
              paddingHorizontal="$4"
              paddingVertical="$3"
              placeholder="카테고리 이름을 입력하세요"
              placeholderTextColor="$textMuted"
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </YStack>

          <XStack gap="$3" marginTop="$2">
            <Button
              backgroundColor="$surface"
              borderColor="$border"
              borderWidth={1}
              color="$textSecondary"
              flex={1}
              onPress={handleClose}
            >
              취소
            </Button>
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
