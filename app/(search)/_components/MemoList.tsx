import { MemoItem } from "@/components/memo/MemoItem";
import { Loading } from "@/components/ui";
import type { UIMemo } from "@/services/memo/memoService";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { Separator, YStack } from "tamagui";

interface MemoListProps {
  memos: UIMemo[];
  onEndReached: () => void;
  isFetchingNextPage: boolean;
}

export function MemoList({
  memos,
  onEndReached,
  isFetchingNextPage,
}: MemoListProps) {
  const renderItem = useCallback(
    ({ item, index }: { item: UIMemo; index: number }) => (
      <YStack key={item.id}>
        <MemoItem memo={item} />
        {index < memos.length - 1 && <Separator borderColor="$border" />}
      </YStack>
    ),
    [memos]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return <Loading size="small" />;
  }, [isFetchingNextPage]);

  return (
    <FlatList
      data={memos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
