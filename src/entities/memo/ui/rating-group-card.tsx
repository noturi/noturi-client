import type { UIMemo } from '~/entities/memo/model/types';
import { ChevronDown } from '~/shared/lib/icons';
import { Card, RatingStars, Typography } from '~/shared/ui';

import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type RatingGroup = {
  rating: number;
  memos: UIMemo[];
};

interface RatingGroupCardProps {
  group: RatingGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onMemoPress?: (memo: UIMemo) => void;
}

const TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(0, 0, 0.2, 1),
};

export function RatingGroupCard({
  group,
  isExpanded,
  onToggle,
  onMemoPress,
}: RatingGroupCardProps) {
  const contentHeight = useSharedValue(0);
  const [isMeasured, setIsMeasured] = useState(false);
  const [prevMemoCount, setPrevMemoCount] = useState(group.memos.length);
  const prevExpanded = useRef(isExpanded);

  const rotation = useSharedValue(isExpanded ? 180 : 0);
  const height = useSharedValue(isExpanded ? 1 : 0);
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  // 메모 수가 바뀌면 높이 재측정 (렌더 중 상태 조정)
  if (prevMemoCount !== group.memos.length) {
    setPrevMemoCount(group.memos.length);
    setIsMeasured(false);
    contentHeight.value = 0;
  }

  // isExpanded 변경 시 애니메이션 (렌더 중 처리)
  if (prevExpanded.current !== isExpanded) {
    prevExpanded.current = isExpanded;
    rotation.value = withTiming(isExpanded ? 180 : 0, TIMING_CONFIG);
    height.value = withTiming(isExpanded ? 1 : 0, TIMING_CONFIG);
    opacity.value = withTiming(isExpanded ? 1 : 0, {
      duration: 200,
      easing: TIMING_CONFIG.easing,
    });
  }

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
      </View>
    </>
  );

  return (
    <Card>
      <Pressable className="flex-row items-center gap-2 p-3 active:opacity-70" onPress={onToggle}>
        <View className="flex-row items-center flex-1 gap-2">
          <RatingStars rating={group.rating} />
          <Typography className="text-text-muted" variant="caption1">
            ({group.memos.length}개)
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
