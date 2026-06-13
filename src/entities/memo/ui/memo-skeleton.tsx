import { Card, Skeleton } from '~/shared/ui';

import { View } from 'react-native';

import { RatingGroupCardSkeleton } from './rating-group-card';

/**
 * 홈 메모 목록 로딩 스켈레톤
 * (카테고리 필터 바 + 헤더 + 별점 그룹 카드 3개)
 */
export function MemoSkeleton() {
  return (
    <View className="gap-6">
      {/* Category Filter Bar */}
      <Card>
        <View className="flex-row gap-4 px-3 py-3">
          <Skeleton borderRadius={4} height={28} width={60} />
          <Skeleton borderRadius={4} height={28} width={45} />
          <Skeleton borderRadius={4} height={28} width={50} />
        </View>
      </Card>

      {/* Header: "메모" + 년도 선택기 */}
      <View className="flex-row items-center justify-between px-3">
        <Skeleton borderRadius={4} height={22} width={40} />
        <View className="flex-row items-center gap-2">
          <Skeleton borderRadius={4} height={18} width={50} />
          <Skeleton borderRadius={4} height={12} width={12} />
        </View>
      </View>

      {/* Rating Group Cards */}
      <View className="mb-5 gap-4">
        {[1, 2, 3].map((i) => (
          <RatingGroupCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}
