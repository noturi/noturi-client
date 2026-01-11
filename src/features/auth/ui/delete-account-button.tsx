import { useAuth } from '~/entities/auth';
import { Typography } from '~/shared/ui';

import { Alert, Pressable } from 'react-native';

import { useDeleteAccountMutation } from '../api/mutation';

export function DeleteAccountButton() {
  const { logout } = useAuth();

  const { mutate: deleteAccount, isPending } = useDeleteAccountMutation({
    onSuccess: () => {
      logout();
    },
    onError: () => {
      Alert.alert('오류', '계정 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const confirmDelete = () => {
    Alert.alert(
      '계정 삭제',
      '정말 계정을 삭제하시겠습니까?\n\n모든 데이터가 삭제되며 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteAccount(),
        },
      ],
    );
  };

  return (
    <Pressable
      className="self-center py-4"
      style={{ opacity: isPending ? 0.5 : 1 }}
      onPress={isPending ? undefined : confirmDelete}
    >
      <Typography className="underline text-text-muted" variant="footnote">
        계정 삭제
      </Typography>
    </Pressable>
  );
}
