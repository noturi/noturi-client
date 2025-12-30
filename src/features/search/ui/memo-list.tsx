import { useUserTheme } from '~/application/providers/theme-provider';
import type { UIMemo } from '~/entities/memo/model/types';
import { MemoItem } from '~/entities/memo/ui/memo-item';
import { Loading } from '~/shared/ui';

import { useCallback } from 'react';
import { FlatList, View } from 'react-native';

interface MemoListProps {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
}

export function MemoList({ memos, onEndReached, isFetchingNextPage }: MemoListProps) {
  const { hexColors } = useUserTheme();

  const renderItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <View key={item.id}>
        <MemoItem memo={item} />
        {index < memos.length - 1 && (
          <View className="h-px" style={{ backgroundColor: hexColors.border }} />
        )}
      </View>
    ),
    [memos, hexColors.border],
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
