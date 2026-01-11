import type { UIMemo } from '~/entities/memo/model/types';
import { MemoItem } from '~/entities/memo/ui/memo-item';
import { Loading, Typography } from '~/shared/ui';

import { useCallback } from 'react';
import { FlatList, View } from 'react-native';

type MemoListViewProps = {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
};

export function MemoListView({ memos, onEndReached, isFetchingNextPage }: MemoListViewProps) {
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="items-center py-1">
        <Loading />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderMemoItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <View key={item.id}>
        <MemoItem memo={item} />
        {index < memos.length - 1 && <View className="h-px bg-border" />}
      </View>
    ),
    [memos.length],
  );

  if (memos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Typography className="text-text-muted" variant="body">
          작성된 메모가 없습니다
        </Typography>
      </View>
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
