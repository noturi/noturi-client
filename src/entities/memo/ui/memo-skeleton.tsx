import { Skeleton } from '~/shared/ui';

import { View } from 'react-native';

import { RatingSectionSkeleton } from './rating-section-rows';

/**
 * 홈 메모 목록 로딩 스켈레톤
 * (카테고리 탭·연도 + 별점 구역 2개)
 */
export function MemoSkeleton() {
  return (
    <View className="gap-5">
      {/* 카테고리 탭 + 연도 */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-5">
          <Skeleton borderRadius={4} height={18} width={32} />
          <Skeleton borderRadius={4} height={18} width={28} />
          <Skeleton borderRadius={4} height={18} width={36} />
        </View>
        <Skeleton borderRadius={4} height={14} width={56} />
      </View>

      <View className="gap-8">
        <RatingSectionSkeleton />
        <RatingSectionSkeleton />
      </View>
    </View>
  );
}
