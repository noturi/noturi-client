import { useToast } from '~/shared/lib';
import { Trash2 } from '~/shared/lib/icons';
import { Button } from '~/shared/ui';

import { Alert } from 'react-native';

import { useDeleteMemoMutation } from '../api/mutations';

interface MemoDeleteButtonProps {
  memoId: string;
  memoTitle: string;
  /** 삭제 성공 후 처리 (예: 화면 이동) — 호출자가 결정 */
  onDeleted?: () => void;
}

export const MemoDeleteButton = ({ memoId, memoTitle, onDeleted }: MemoDeleteButtonProps) => {
  const toast = useToast();
  const deleteMutation = useDeleteMemoMutation({
    onSuccess: () => {
      toast.showSuccess('메모가 삭제되었습니다');
      onDeleted?.();
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
    <Button
      isIconOnly
      isDisabled={deleteMutation.isPending}
      size="sm"
      variant="ghost"
      onPress={handleDelete}
    >
      <Trash2 className="text-text-primary" size={16} />
    </Button>
  );
};
