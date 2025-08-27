import { YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import { Loading, Typography } from '~/shared/ui';

type MemoSimpleViewProps = {
  memos: UIMemo[];
  isPending: boolean;
  isError: boolean;
  onMemoPress?: (memo: UIMemo) => void;
};

export function MemoSimpleView({ memos, isPending, isError, onMemoPress }: MemoSimpleViewProps) {
  if (isPending) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Loading />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Typography color="$textMuted">메모를 불러오는데 실패했습니다</Typography>
      </YStack>
    );
  }

  if (memos.length === 0) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Typography color="$textMuted">작성된 메모가 없습니다</Typography>
      </YStack>
    );
  }

  return (
    <YStack gap="$sm" padding="$lg">
      {memos.map((memo) => (
        <Typography
          key={memo.id}
          pressable
          color="$textPrimary"
          paddingVertical="$xs"
          pointerEvents="box-only"
          size="$md"
          onPress={() => onMemoPress?.(memo)}
        >
          • {memo.title}
        </Typography>
      ))}
    </YStack>
  );
}
