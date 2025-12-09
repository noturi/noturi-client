import { toast } from 'sonner-native';
import { Button } from '~/shared/ui';

import { Alert } from 'react-native';

import { router } from 'expo-router';

import { Trash2 } from '@tamagui/lucide-icons';

import { useDeleteMemoMutation } from '../api/mutations';

interface MemoDeleteButtonProps {
  memoId: string;
  memoTitle: string;
  onDelete?: () => void;
}

export const MemoDeleteButton = ({ memoId, memoTitle, onDelete }: MemoDeleteButtonProps) => {
  const deleteMutation = useDeleteMemoMutation({
    onSuccess: () => {
      toast.success('메모가 삭제되었습니다');
      onDelete?.();
      router.back();
    },
    onError: () => {
      Alert.alert('오류', '메모 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    Alert.alert('메모 삭제', `"${memoTitle}" 메모를 정말로 삭제하시겠습니까?`, [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteMutation.mutate(memoId);
        },
      },
    ]);
  };

  return (
    <Button disabled={deleteMutation.isPending} size="sm" variant="ghost" onPress={handleDelete}>
      <Trash2 size={16} />
    </Button>
  );
};
