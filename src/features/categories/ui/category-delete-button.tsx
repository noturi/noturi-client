import { useToast } from '~/shared/lib';
import { X } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Alert, Pressable, View } from 'react-native';

import { useDeleteCategoryMutation } from '../api/mutations';

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
  const toast = useToast();
  const deleteCategoryMutation = useDeleteCategoryMutation({
    onSuccess: () => {
      toast.showSuccess('카테고리가 삭제되었습니다');
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
      <View className="flex-row items-center gap-2 rounded-4 border border-border bg-surface px-3 py-2">
        <Typography variant="caption1">{categoryName}</Typography>
        <X className="text-danger" size={14} />
      </View>
    </Pressable>
  );
}
