import type { UIMemo } from '~/entities/memo';
import { MemoItem } from '~/entities/memo';
import { Loading } from '~/shared/ui';

import { FlatList, View } from 'react-native';

interface MemoListProps {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  onPressMemo: (memo: UIMemo) => void;
}

export function MemoList({ memos, onEndReached, isFetchingNextPage, onPressMemo }: MemoListProps) {
  const renderItem = ({ item, index }: { item: UIMemo; index: number }) => (
    <View key={item.id}>
      <MemoItem memo={item} onPress={onPressMemo} />
      {index < memos.length - 1 && <View className="h-px bg-border" />}
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <Loading size="small" />;
  };

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
