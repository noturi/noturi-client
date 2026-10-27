import type { UIMemo } from '~/entities/memo';
import { MemoItem } from '~/entities/memo';
import { Loading } from '~/shared/ui';

import { useCallback } from 'react';
import { FlatList, View } from 'react-native';

interface MemoListProps {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  onPressMemo: (memo: UIMemo) => void;
}

export function MemoList({ memos, onEndReached, isFetchingNextPage, onPressMemo }: MemoListProps) {
  const renderItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <View key={item.id}>
        <MemoItem memo={item} onPress={onPressMemo} />
        {index < memos.length - 1 && <View className="h-px bg-border" />}
      </View>
    ),
    [memos.length, onPressMemo],
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
