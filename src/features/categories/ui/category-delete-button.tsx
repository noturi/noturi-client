import { X } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { useDeleteCategoryMutation } from '~/features/categories/api/mutations';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

import { Alert, Pressable, View } from 'react-native';

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
  const { currentTheme } = useUserTheme();
  const surfaceColor = rgbToHex(currentTheme.colors.surface);
  const borderColor = rgbToHex(currentTheme.colors.border);

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
      <View
        className="flex-row items-center gap-2 rounded-4 px-3 py-2"
        style={{
          backgroundColor: surfaceColor,
          borderColor: borderColor,
          borderWidth: 1,
        }}
      >
        <Typography variant="caption1">{categoryName}</Typography>
        <X color="#ef4444" size={14} />
      </View>
    </Pressable>
  );
}
