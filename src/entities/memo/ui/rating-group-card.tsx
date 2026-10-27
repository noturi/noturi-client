import { ChevronDown } from '~/shared/lib/icons';
import { Card, RatingStars, Skeleton, Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { RatingGroupData, UIMemo } from '../model/types';

interface RatingGroupCardProps {
  group: RatingGroupData;
  isExpanded: boolean;
  /**
   * 목록 끝 센티넬 View. 펼쳐져 있고 다음 페이지가 있을 때만 렌더되며, 사라지면 null로 호출된다.
   * 이 컴포넌트는 페이지를 직접 불러오지 않는다 — 스크롤 소유자가 위치를 재서 결정한다.
   */
  endSentinelRef?: (node: View | null) => void;
  /** 센티넬 레이아웃 변경 (마운트, 메모 추가로 위치 이동) */
  onEndSentinelLayout?: () => void;
  onToggle: () => void;
  onMemoPress?: (memo: UIMemo) => void;
}

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0, 0, 0.2, 1),
};

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

export function RatingGroupCard({
  group,
  isExpanded,
  endSentinelRef,
  onEndSentinelLayout,
  onToggle,
  onMemoPress,
}: RatingGroupCardProps) {
  const contentHeight = useSharedValue(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const prevMemoCountRef = useRef(group.memos.length);
  const prevExpanded = useRef(isExpanded);

  const rotation = useSharedValue(isExpanded ? 180 : 0);
  const height = useSharedValue(isExpanded ? 1 : 0);
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  // 메모 수가 바뀌면 높이 재측정
  useEffect(() => {
    if (prevMemoCountRef.current !== group.memos.length) {
      prevMemoCountRef.current = group.memos.length;
      setIsMeasured(false);
      contentHeight.set(0);
    }
  }, [group.memos.length, contentHeight]);

  // isExpanded 변경 시 애니메이션
  useEffect(() => {
    if (prevExpanded.current !== isExpanded) {
      prevExpanded.current = isExpanded;
      rotation.set(withTiming(isExpanded ? 180 : 0, TIMING_CONFIG));
      height.set(withTiming(isExpanded ? 1 : 0, TIMING_CONFIG));
      opacity.set(
        withTiming(isExpanded ? 1 : 0, {
          duration: 200,
          easing: TIMING_CONFIG.easing,
        }),
      );
    }
  }, [isExpanded, rotation, height, opacity]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: contentHeight.get() > 0 ? height.get() * contentHeight.get() : 0,
    opacity: opacity.get(),
    overflow: 'hidden' as const,
  }));

  const handleLayout = (e: { nativeEvent: { layout: { height: number } } }) => {
    const measuredHeight = e.nativeEvent.layout.height;
    if (measuredHeight > 0) {
      contentHeight.set(measuredHeight);
      if (!isMeasured) setIsMeasured(true);
    }
  };

  const memoList = (
    <>
      <View className="mx-3 h-px bg-border" />
      <View className="p-3">
        {group.memos.map((memo) => (
          <Pressable
            key={memo.id}
            className="self-start py-1 active:opacity-70"
            onPress={() => onMemoPress?.(memo)}
          >
            <Typography className="text-text-primary" variant="callout">
              {memo.title}
            </Typography>
          </Pressable>
        ))}
        {group.isFetchingNextPage && (
          <View className="items-center py-2">
            <ActivityIndicator size="small" />
          </View>
        )}
        {isExpanded && group.hasNextPage && (
          <View ref={endSentinelRef} collapsable={false} onLayout={onEndSentinelLayout} />
        )}
      </View>
    </>
  );

  return (
    <Card>
      <Pressable className="flex-row items-center gap-2 p-3 active:opacity-70" onPress={onToggle}>
        <View className="flex-1 flex-row items-center gap-2">
          {group.rating > 0 ? (
            <RatingStars rating={group.rating} />
          ) : (
            <Typography className="text-text-secondary" variant="callout">
              별점 없음
            </Typography>
          )}
          <Typography className="text-text-muted" variant="caption1">
            ({group.total}개)
          </Typography>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown className="text-text-muted" size={16} />
        </Animated.View>
      </Pressable>

      {isMeasured ? (
        <Animated.View style={contentStyle}>
          <View onLayout={handleLayout}>{memoList}</View>
        </Animated.View>
      ) : isExpanded ? (
        <View onLayout={handleLayout}>{memoList}</View>
      ) : (
        <View className="absolute opacity-0" pointerEvents="none" onLayout={handleLayout}>
          {memoList}
        </View>
      )}
    </Card>
  );
}
