import { FlashList } from '@shopify/flash-list';
import {
  RatingSectionMemoRow,
  RatingSectionSkeleton,
  UNRATED,
  infiniteMemoListQuery,
  ratingGroupFilter,
  toUIMemos,
} from '~/entities/memo';
import { HREFS } from '~/shared/config/routes';
import { EmptyStateCard } from '~/shared/ui';

import { ActivityIndicator, View } from 'react-native';

import { Stack, router } from 'expo-router';

import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_LIMIT = 50;

interface RatingMemosPageProps {
  /** 5~1, 0 = 별점 없음 */
  rating: number;
  categoryId?: string;
  year?: number;
}

/** 한 별점의 메모 전체 — 홈 구역의 "전체"에서 들어옴. 스크롤하면 이어서 불러온다 */
export function RatingMemosPage({ rating, categoryId, year }: RatingMemosPageProps) {
  const query = useInfiniteQuery(
    infiniteMemoListQuery({
      ...ratingGroupFilter(rating),
      categoryId,
      year,
      limit: PAGE_LIMIT,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  );

  const memos = toUIMemos(query.data?.pages.flatMap((page) => page.data));
  const total = query.data?.pages[0]?.total ?? 0;
  const title = rating === UNRATED ? '별점 없음' : `${'★'.repeat(rating)}`;

  return (
    <View className="flex-1 bg-bg-secondary px-4">
      <Stack.Screen options={{ title: total > 0 ? `${title}  ${total}` : title }} />
      <FlashList
        contentContainerStyle={{ paddingBottom: 80 }}
        data={memos}
        keyExtractor={(memo) => memo.id}
        ListEmptyComponent={
          query.isLoading ? (
            <RatingSectionSkeleton />
          ) : (
            <EmptyStateCard description="다른 별점을 확인해 보세요" title="메모가 없어요" />
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? <ActivityIndicator className="py-4" size="small" /> : null
        }
        renderItem={({ item }) => (
          <RatingSectionMemoRow
            memo={item}
            onPress={(memo) => router.push(HREFS.memoDetail(memo.id))}
          />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
