import { Separator, YStack } from 'tamagui';

import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { MemoItem } from '@/components/memo/MemoItem';
import { Loading } from '@/components/ui';
import type { UIMemo } from '@/services/memo/memoService';

interface MemoListProps {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
}

export function MemoList({ memos, onEndReached, isFetchingNextPage }: MemoListProps) {
  const renderItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <YStack key={item.id}>
        <MemoItem memo={item} />
        {index < memos.length - 1 && <Separator borderColor="$border" />}
      </YStack>
    ),
    [memos],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return <Loading size="small" />;
  }, [isFetchingNextPage]);

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 24 }}
      data={memos}
      keyExtractor={(item) => item.id}
      ListFooterComponent={renderFooter}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
