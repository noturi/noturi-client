import type { RatingGroupData, UIMemo } from '~/entities/memo/model/types';
import { ChevronDown } from '~/shared/lib/icons';
import { Card, RatingStars, Skeleton, Typography } from '~/shared/ui';

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RatingGroupCardProps {
  group: RatingGroupData;
  isExpanded: boolean;
  onToggle: () => void;
  onMemoPress?: (memo: UIMemo) => void;
}

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0, 0, 0.2, 1),
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SENTINEL_THRESHOLD = 200;

export function RatingGroupCardSkeleton() {
  return (
    <Card>
      <View className="flex-row items-center gap-2 p-3">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="flex-row gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Skeleton key={star} borderRadius={2} height={14} width={14} />
            ))}
          </View>
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
  onToggle,
  onMemoPress,
}: RatingGroupCardProps) {
  const contentHeight = useSharedValue(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const prevMemoCountRef = useRef(group.memos.length);
  const prevExpanded = useRef(isExpanded);
  const sentinelRef = useRef<View>(null);

  const rotation = useSharedValue(isExpanded ? 180 : 0);
  const height = useSharedValue(isExpanded ? 1 : 0);
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  // 메모 수가 바뀌면 높이 재측정
  useEffect(() => {
    if (prevMemoCountRef.current !== group.memos.length) {
      prevMemoCountRef.current = group.memos.length;
      setIsMeasured(false);
      contentHeight.value = 0;
    }
  }, [group.memos.length, contentHeight]);

  // isExpanded 변경 시 애니메이션
  useEffect(() => {
    if (prevExpanded.current !== isExpanded) {
      prevExpanded.current = isExpanded;
      rotation.value = withTiming(isExpanded ? 180 : 0, TIMING_CONFIG);
      height.value = withTiming(isExpanded ? 1 : 0, TIMING_CONFIG);
      opacity.value = withTiming(isExpanded ? 1 : 0, {
        duration: 200,
        easing: TIMING_CONFIG.easing,
      });
    }
  }, [isExpanded, rotation, height, opacity]);

  // 센티넬이 화면에 보이는지 주기적으로 확인하여 무한스크롤 트리거
  useEffect(() => {
    if (!group.hasNextPage || group.isFetchingNextPage || !isExpanded) return;

    const interval = setInterval(() => {
      sentinelRef.current?.measureInWindow((_x: number, y: number) => {
        if (y > 0 && y < SCREEN_HEIGHT + SENTINEL_THRESHOLD) {
          group.fetchNextPage();
        }
      });
    }, 300);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.hasNextPage, group.isFetchingNextPage, isExpanded, group.fetchNextPage]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: contentHeight.value > 0 ? height.value * contentHeight.value : 0,
    opacity: opacity.value,
    overflow: 'hidden' as const,
  }));

  const handleLayout = (e: { nativeEvent: { layout: { height: number } } }) => {
    const measuredHeight = e.nativeEvent.layout.height;
    if (measuredHeight > 0) {
      contentHeight.value = measuredHeight;
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
        {group.hasNextPage && <View ref={sentinelRef} />}
      </View>
    </>
  );

  return (
    <Card>
      <Pressable className="flex-row items-center gap-2 p-3 active:opacity-70" onPress={onToggle}>
        <View className="flex-1 flex-row items-center gap-2">
          <RatingStars rating={group.rating} />
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
