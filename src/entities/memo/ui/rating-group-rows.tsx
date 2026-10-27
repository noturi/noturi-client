import { DURATION } from '~/shared/config';
import { EASING } from '~/shared/lib';
import { ChevronDown } from '~/shared/lib/icons';
import { Card, RatingStars, Skeleton, Typography } from '~/shared/ui';

import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { UIMemo } from '../model/types';

/*
 * 별점 그룹 "카드"를 가상화 리스트용 행으로 쪼갠 표시 컴포넌트.
 * 헤더(카드 상단) → 메모 행(카드 중간) → 푸터(카드 하단)가 이어 붙어 하나의 카드처럼 보인다.
 * 접힌 그룹은 헤더 행 하나가 카드 전체(모서리 4개 둥금)가 된다.
 * 데이터 조회/페이지 로딩/펼침 상태는 소유하지 않는다 — 전부 props로 받는다.
 */

const CHEVRON_TIMING = {
  duration: DURATION.d5,
  easing: EASING.enter,
};

interface RatingGroupHeaderRowProps {
  rating: number;
  total: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RatingGroupHeaderRow({
  rating,
  total,
  isExpanded,
  onToggle,
}: RatingGroupHeaderRowProps) {
  const rotation = useSharedValue(isExpanded ? 180 : 0);
  // 리스트 셀 재활용으로 다른 그룹의 헤더가 될 수 있다 — 같은 그룹의 토글일 때만 애니메이션
  const prevRef = useRef({ rating, isExpanded });

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { rating, isExpanded };
    const target = isExpanded ? 180 : 0;
    if (prev.rating === rating && prev.isExpanded !== isExpanded) {
      rotation.set(withTiming(target, CHEVRON_TIMING));
    } else {
      rotation.set(target);
    }
  }, [rating, isExpanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  return (
    <View className={`bg-surface px-3 pt-3 ${isExpanded ? 'rounded-t-6' : 'rounded-6 pb-3'}`}>
      <Pressable className="flex-row items-center gap-2 p-3 active:opacity-70" onPress={onToggle}>
        <View className="flex-1 flex-row items-center gap-2">
          {rating > 0 ? (
            <RatingStars rating={rating} />
          ) : (
            <Typography className="text-text-secondary" variant="callout">
              별점 없음
            </Typography>
          )}
          <Typography className="text-text-muted" variant="caption1">
            ({total}개)
          </Typography>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown className="text-text-muted" size={16} />
        </Animated.View>
      </Pressable>
      {isExpanded && (
        <>
          <View className="mx-3 h-px bg-border" />
          <View className="h-3" />
        </>
      )}
    </View>
  );
}

interface RatingGroupMemoRowProps {
  memo: UIMemo;
  onPress: (memo: UIMemo) => void;
}

export function RatingGroupMemoRow({ memo, onPress }: RatingGroupMemoRowProps) {
  return (
    <View className="bg-surface px-6">
      <Pressable className="self-start py-1 active:opacity-70" onPress={() => onPress(memo)}>
        <Typography className="text-text-primary" variant="callout">
          {memo.title}
        </Typography>
      </Pressable>
    </View>
  );
}

interface RatingGroupFooterRowProps {
  isFetchingNextPage: boolean;
}

export function RatingGroupFooterRow({ isFetchingNextPage }: RatingGroupFooterRowProps) {
  return (
    <View className="rounded-b-6 bg-surface px-6 pb-6">
      {isFetchingNextPage && (
        <View className="items-center py-2">
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
}

export function RatingGroupCardSkeleton() {
  return (
    <Card>
      <View className="flex-row items-center gap-2 p-3">
        <View className="flex-1 flex-row items-center gap-2">
          <Skeleton borderRadius={2} height={14} width={86} />
          <Skeleton borderRadius={4} height={14} width={28} />
        </View>
        <Skeleton borderRadius={2} height={16} width={16} />
      </View>
      <View className="mx-3 h-px bg-border" />
      <View className="gap-2 p-3">
        <Skeleton borderRadius={4} height={18} width="70%" />
        <Skeleton borderRadius={4} height={18} width="55%" />
        <Skeleton borderRadius={4} height={18} width="45%" />
      </View>
    </Card>
  );
}
