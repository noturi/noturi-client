import { BOUNCE_DURATION, DURATION } from '~/shared/config';
import { EASING } from '~/shared/lib';

import { ViewStyle } from 'react-native';
import {
  type AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CheckAnimationStyles {
  checkStyle: AnimatedStyle<ViewStyle>;
  circleStyle: AnimatedStyle<ViewStyle>;
  contentStyle: AnimatedStyle<ViewStyle>;
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
      circleScale.set(
        withSequence(
          withTiming(0.85, { duration: BOUNCE_DURATION.squash }),
          withTiming(1.08, { duration: BOUNCE_DURATION.overshoot }),
          withTiming(1, { duration: BOUNCE_DURATION.settle }),
        ),
      );
      checkScale.set(
        withSequence(
          withTiming(0, { duration: DURATION.d1 }),
          withTiming(1.15, { duration: DURATION.d3 }),
          withTiming(1, { duration: DURATION.d2 }),
        ),
      );
      checkOpacity.set(withTiming(1, { duration: DURATION.d3 }));
      contentOpacity.set(withTiming(1, { duration: DURATION.d6, easing: EASING.out }));
    } else {
      circleScale.set(
        withSequence(
          withTiming(1.08, { duration: BOUNCE_DURATION.squash }),
          withTiming(1, { duration: BOUNCE_DURATION.settle }),
        ),
      );
      checkScale.set(withTiming(0, { duration: BOUNCE_DURATION.overshoot }));
      checkOpacity.set(withTiming(0, { duration: DURATION.d2 }));
      contentOpacity.set(withTiming(0, { duration: DURATION.d4 }));
    }
  };

  const checkStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: checkScale.get() }],
    opacity: checkOpacity.get(),
  }));

  const circleStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [{ scale: circleScale.get() }],
  }));

  const contentStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: 0.4 + (1 - contentOpacity.get()) * 0.6,
  }));

  return { animate, checkStyle, circleStyle, contentStyle };
}
