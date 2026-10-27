import { ViewStyle } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CheckAnimationStyles {
  checkStyle: ViewStyle;
  circleStyle: ViewStyle;
  contentStyle: ViewStyle;
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
          withTiming(0.85, { duration: 80 }),
          withTiming(1.08, { duration: 120 }),
          withTiming(1, { duration: 100 }),
        ),
      );
      checkScale.set(
        withSequence(
          withTiming(0, { duration: 50 }),
          withTiming(1.15, { duration: 150 }),
          withTiming(1, { duration: 100 }),
        ),
      );
      checkOpacity.set(withTiming(1, { duration: 150 }));
      contentOpacity.set(withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }));
    } else {
      circleScale.set(
        withSequence(withTiming(1.08, { duration: 80 }), withTiming(1, { duration: 100 })),
      );
      checkScale.set(withTiming(0, { duration: 120 }));
      checkOpacity.set(withTiming(0, { duration: 100 }));
      contentOpacity.set(withTiming(0, { duration: 200 }));
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
