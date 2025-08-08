import { Separator, YStack } from 'tamagui';

import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { MemoItem } from '@/components/memo';
import { Loading, Typography } from '@/components/ui';
import type { UIMemo } from '@/services/memo/memoService';

type MemoListViewProps = {
  memos: UIMemo[];
  isPending: boolean;
  isError: boolean;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
};

export function MemoListView({
  memos,
  isPending,
  isError,
  onEndReached,
  isFetchingNextPage,
}: MemoListViewProps) {
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack alignItems="center" paddingVertical="$4">
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
