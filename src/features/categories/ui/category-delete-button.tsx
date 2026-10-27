import { useToast } from '~/shared/lib';
import { X } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Alert, Pressable, View } from 'react-native';

import { useDeleteCategoryMutation } from '../api/mutations';

interface CategoryDeleteButtonProps {
  categoryId: string;
  categoryName: string;
  /** 소속 메모 수 — 삭제 시 '기타'로 이동됨을 안내 */
  memoCount?: number;
  disabled?: boolean;
}

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  memoCount = 0,
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

    // 메모는 삭제되지 않고 카테고리 없음('기타')으로 이동
    const memoNotice =
      memoCount > 0 ? `\n이 카테고리의 메모 ${memoCount}개는 '기타'로 이동됩니다.` : '';
    Alert.alert(
      '카테고리 삭제',
      `'${categoryName}' 카테고리를 정말 삭제하시겠습니까?${memoNotice}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteCategoryMutation.mutate(categoryId),
        },
      ],
    );
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
