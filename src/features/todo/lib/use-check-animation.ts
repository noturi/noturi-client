import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CheckAnimationStyles {
  checkStyle: ReturnType<typeof useAnimatedStyle>;
  circleStyle: ReturnType<typeof useAnimatedStyle>;
  contentStyle: ReturnType<typeof useAnimatedStyle>;
}

interface UseCheckAnimationReturn extends CheckAnimationStyles {
  animate: (toCompleted: boolean) => void;
}

/**
 * 투두 체크박스 애니메이션을 관리하는 훅
 * - 체크 아이콘: scale + opacity
 * - 체크박스 원: bounce scale
 * - 텍스트 영역: opacity fade
 */
export function useCheckAnimation(initialCompleted: boolean): UseCheckAnimationReturn {
  const checkScale = useSharedValue(initialCompleted ? 1 : 0);
  const checkOpacity = useSharedValue(initialCompleted ? 1 : 0);
  const circleScale = useSharedValue(1);
  const contentOpacity = useSharedValue(initialCompleted ? 1 : 0);

  const animate = (toCompleted: boolean) => {
    if (toCompleted) {
      circleScale.value = withSequence(
        withTiming(0.85, { duration: 80 }),
        withTiming(1.08, { duration: 120 }),
        withTiming(1, { duration: 100 }),
      );
      checkScale.value = withSequence(
        withTiming(0, { duration: 50 }),
        withTiming(1.15, { duration: 150 }),
        withTiming(1, { duration: 100 }),
      );
      checkOpacity.value = withTiming(1, { duration: 150 });
      contentOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    } else {
      circleScale.value = withSequence(
        withTiming(1.08, { duration: 80 }),
        withTiming(1, { duration: 100 }),
      );
      checkScale.value = withTiming(0, { duration: 120 });
      checkOpacity.value = withTiming(0, { duration: 100 });
      contentOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + (1 - contentOpacity.value) * 0.6,
  }));

  return { animate, checkStyle, circleStyle, contentStyle };
}
