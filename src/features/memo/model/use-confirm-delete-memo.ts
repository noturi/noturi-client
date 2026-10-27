import { useToast } from '~/shared/lib';

import { Alert } from 'react-native';

import { useDeleteMemoMutation } from '../api';

/** 메모 삭제 확인 → 삭제 → 결과 토스트 (상세 화면 삭제 버튼·목록 길게 누르기 메뉴 공통) */
export function useConfirmDeleteMemo() {
  const toast = useToast();
  const deleteMutation = useDeleteMemoMutation({
    onError: () => {
      Alert.alert('오류', '메모 삭제에 실패했습니다.');
    },
  });

  const confirmDelete = (memo: { id: string; title: string }, onDeleted?: () => void) => {
    Alert.alert('메모 삭제', `"${memo.title}" 메모를 정말로 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () =>
          deleteMutation.mutate(memo.id, {
            onSuccess: () => {
              toast.showSuccess('메모가 삭제되었습니다');
              onDeleted?.();
            },
          }),
      },
    ]);
  };

  return { confirmDelete, isDeleting: deleteMutation.isPending };
}
