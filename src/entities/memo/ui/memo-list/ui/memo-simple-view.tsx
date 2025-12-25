import { Pressable, View } from 'react-native';

import type { UIMemo } from '~/entities/memo/model/types';
import { Typography } from '~/shared/ui';

type MemoSimpleViewProps = {
  memos: UIMemo[];
  onMemoPress?: (memo: UIMemo) => void;
};

export function MemoSimpleView({ memos, onMemoPress }: MemoSimpleViewProps) {
  if (memos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Typography className="text-text-muted">작성된 메모가 없습니다</Typography>
      </View>
    );
  }

  return (
    <View className="gap-2 p-4">
      {memos.map((memo) => (
        <Pressable key={memo.id} className="py-1" onPress={() => onMemoPress?.(memo)}>
          <Typography className="text-text-primary text-3">• {memo.title}</Typography>
        </Pressable>
      ))}
    </View>
  );
}
