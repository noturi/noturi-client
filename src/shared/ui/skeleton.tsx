import { useTheme } from 'tamagui';

import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  circle?: boolean;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, circle }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const size = circle ? height : undefined;

  return (
    <Animated.View
      style={[
        {
          width: circle ? size : width,
          height,
          borderRadius: circle ? height / 2 : borderRadius,
          backgroundColor: theme.border?.val,
        },
        animatedStyle,
      ]}
    />
  );
}
