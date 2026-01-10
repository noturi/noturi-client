import type { UIMemo } from '~/entities/memo/model/types';
import { ChevronDown } from '~/shared/lib/icons';
import { Card, RatingStars, Typography } from '~/shared/ui';

import { useEffect, useState } from 'react';
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

export function RatingGroupCard({
  group,
  isExpanded,
  onToggle,
  onMemoPress,
}: RatingGroupCardProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const rotation = useSharedValue(isExpanded ? 180 : 0);
  const height = useSharedValue(isExpanded ? 1 : 0);
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    // 첫 렌더링 후에만 애니메이션 적용
    if (hasAnimated) {
      rotation.value = withTiming(isExpanded ? 180 : 0, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      height.value = withTiming(isExpanded ? 1 : 0, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      opacity.value = withTiming(isExpanded ? 1 : 0, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      // 초기 상태 즉시 설정
      rotation.value = isExpanded ? 180 : 0;
      height.value = isExpanded ? 1 : 0;
      opacity.value = isExpanded ? 1 : 0;
      setHasAnimated(true);
    }
  }, [isExpanded, rotation, height, opacity, hasAnimated]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0 ? height.value * contentHeight : (isExpanded ? undefined : 0),
    opacity: opacity.value,
    overflow: 'hidden',
  }));

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

      <Animated.View style={contentStyle}>
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            if (measuredHeight > 0 && contentHeight === 0) {
              setContentHeight(measuredHeight);
              if (isExpanded) {
                height.value = 1;
              }
            }
          }}
        >
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
        </View>
      </Animated.View>

      {/* Hidden view to measure content height */}
      {contentHeight === 0 && (
        <View
          className="absolute opacity-0"
          pointerEvents="none"
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            if (measuredHeight > 0) {
              setContentHeight(measuredHeight);
              if (isExpanded) {
                height.value = 1;
              }
            }
          }}
        >
          <View className="mx-3 h-px bg-border" />
          <View className="p-3">
            {group.memos.map((memo) => (
              <View key={memo.id} className="py-1">
                <Typography className="text-text-primary" variant="callout">
                  {memo.title}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}
