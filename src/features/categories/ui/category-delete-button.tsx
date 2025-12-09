import { toast } from 'sonner-native';
import { XStack } from 'tamagui';
import { useDeleteCategoryMutation } from '~/features/categories/api/mutations';
import { Typography } from '~/shared/ui';

import { Alert, Pressable } from 'react-native';

import { X } from '@tamagui/lucide-icons';

interface CategoryDeleteButtonProps {
  categoryId: string;
  categoryName: string;
  disabled?: boolean;
}

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  disabled = false,
}: CategoryDeleteButtonProps) {
  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      toast.success('카테고리가 삭제되었습니다');
    },
  });

  const handlePress = () => {
    if (disabled) {
      Alert.alert('삭제 불가', '마지막 카테고리는 삭제할 수 없습니다.', [
        { text: '확인', style: 'default' },
      ]);
      return;
    }

    deleteCategoryMutation.mutate(categoryId);
  };

  return (
    <Pressable
      disabled={deleteCategoryMutation.isPending}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: pressed ? 0.95 : 1,
      })}
      onPress={handlePress}
    >
      <XStack
        alignItems="center"
        backgroundColor="$surface"
        borderColor="$border"
        borderRadius="$4"
        borderWidth={1}
        gap="$2"
        paddingHorizontal="$3"
        paddingVertical="$2"
      >
        <Typography variant="caption1">{categoryName}</Typography>
        <X color="$error" size="$2" />
      </XStack>
    </Pressable>
  );
}
