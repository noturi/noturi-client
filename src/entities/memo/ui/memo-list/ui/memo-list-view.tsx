import { Separator, YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import { MemoItem } from '~/features/memo/ui/memo-item';
import { Typography } from '~/shared/ui';
import { Loading } from '~/widgets';

import { useCallback } from 'react';
import { FlatList } from 'react-native';

type MemoListViewProps = {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
};

export function MemoListView({ memos, onEndReached, isFetchingNextPage }: MemoListViewProps) {
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack alignItems="center" paddingVertical="$1">
        <Loading />
      </YStack>
    );
  }, [isFetchingNextPage]);

  const renderMemoItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <YStack key={item.id}>
        <MemoItem memo={item} />
        {index < memos.length - 1 && <Separator borderColor="$border" />}
      </YStack>
    ),
    [memos.length],
  );

  if (memos.length === 0) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Typography color="$textMuted" variant="body">
          작성된 메모가 없습니다
        </Typography>
      </YStack>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 24 }}
      data={memos}
      keyExtractor={(item) => item.id}
      ListFooterComponent={renderFooter}
      renderItem={renderMemoItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
