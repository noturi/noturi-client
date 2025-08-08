import { Button, ScrollView, Sheet, TextArea, XStack, YStack } from 'tamagui';

import { useEffect, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';

import { Trash } from '@tamagui/lucide-icons';

import { useQuery } from '@tanstack/react-query';

import { Typography } from '@/components/ui';
import { activeCategoriesQuery, useCreateCategoryMutation } from '@/services/category';
import { useDeleteCategoryMutation } from '@/services/category/mutations';

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');

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
      const height = Platform.OS === 'ios' ? e.endCoordinates.height - 34 : e.endCoordinates.height;
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
      snapPoints={[50, 50]}
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
            닫기
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
        <YStack flex={1} padding="$4" onStartShouldSetResponder={() => true}>
          {/* Add new category */}
          <XStack alignItems="center" gap="$2" marginBottom="$3">
            <TextArea
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
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
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
          </XStack>

          {/* Category list */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack gap="$2">
              {categories.map((category) => (
                <XStack
                  key={category.id}
                  alignItems="center"
                  backgroundColor="$surface"
                  borderRadius="$4"
                  justifyContent="space-between"
                  padding="$3"
                >
                  <Typography color="$textPrimary" variant="body">
                    {category.name}
                  </Typography>
                  <Button
                    backgroundColor="$surface"
                    borderRadius="$4"
                    color="$error"
                    pressStyle={{ backgroundColor: '$surfaceHover' }}
                    size="$2"
                    onPress={() => handleDeleteCategory(category.id, category.name)}
                  >
                    <Trash color="$error" size={16} />
                  </Button>
                </XStack>
              ))}
            </YStack>
          </ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
