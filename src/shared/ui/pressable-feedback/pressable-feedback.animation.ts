import { useCallback, useMemo } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  BASE_RIPPLE_PROGRESS_DURATION,
  BASE_RIPPLE_PROGRESS_DURATION_MIN,
  DEFAULT_HIGHLIGHT_OPACITY,
  DEFAULT_RIPPLE_OPACITY,
  DEFAULT_RIPPLE_SCALE,
  DEFAULT_SCALE_VALUE,
} from './pressable-feedback.constants';
import type {
  HighlightAnimationConfig,
  HighlightAnimationResult,
  PressableFeedbackContextValue,
  RippleAnimationConfig,
  RippleAnimationResult,
  RootAnimationConfig,
  RootAnimationResult,
} from './pressable-feedback.types';

const DEFAULT_HIGHLIGHT_COLOR_LIGHT = '#3f3f46';
const DEFAULT_HIGHLIGHT_COLOR_DARK = '#d4d4d8';

export function usePressableFeedbackRootAnimation(options?: {
  animation?: RootAnimationConfig;
  isDark?: boolean;
}): RootAnimationResult {
  const { animation } = options ?? {};

  // Extract config values with defaults
  const scaleValue = animation?.scale?.value ?? DEFAULT_SCALE_VALUE;
  const scaleDuration = animation?.scale?.timingConfig?.duration ?? 300;
  const scaleTimingConfig = useMemo(
    () => ({
      duration: scaleDuration,
      easing: Easing.out(Easing.ease),
    }),
    [scaleDuration],
  );
  const ignoreScaleCoefficient = animation?.scale?.ignoreScaleCoefficient ?? false;

  // Shared values
  const isPressed = useSharedValue(false);
  const scale = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const pressedCenterX = useSharedValue(0);
  const pressedCenterY = useSharedValue(0);

  // Calculate adjusted scale based on container size
  const adjustedScaleValue = useDerivedValue(() => {
    if (ignoreScaleCoefficient) return scaleValue;

    // Maintain consistent scale effect across different sizes
    const coefficient = containerWidth.get() > 0 ? 300 / containerWidth.get() : 1;
    return 1 - (1 - scaleValue) * Math.min(coefficient, 1.5);
  });

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      isPressed.set(true);
      pressedCenterX.set(e.nativeEvent.locationX);
      pressedCenterY.set(e.nativeEvent.locationY);
      scale.set(withTiming(1, scaleTimingConfig));
    },
    [isPressed, pressedCenterX, pressedCenterY, scale, scaleTimingConfig],
  );

  const onPressOut = useCallback(
    (_e: GestureResponderEvent) => {
      isPressed.set(false);
      scale.set(withTiming(0, scaleTimingConfig));
    },
    [isPressed, scale, scaleTimingConfig],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      containerWidth.set(e.nativeEvent.layout.width);
      containerHeight.set(e.nativeEvent.layout.height);
    },
    [containerWidth, containerHeight],
  );

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scale.get(), [0, 1], [1, adjustedScaleValue.get()]),
      },
    ],
  }));

  const contextValue: PressableFeedbackContextValue = {
    isPressed,
    containerWidth,
    containerHeight,
    pressedCenterX,
    pressedCenterY,
  };

  return {
    containerStyle,
    onPressIn,
    onPressOut,
    onLayout,
    contextValue,
  };
}

/**
 * Animation hook for PressableFeedback highlight overlay
 * Handles opacity and background color animations
 */
export function usePressableFeedbackHighlightAnimation(
  context: PressableFeedbackContextValue,
  options?: {
    animation?: HighlightAnimationConfig;
    isDark?: boolean;
  },
): HighlightAnimationResult {
  const { animation, isDark = false } = options ?? {};
  const { isPressed } = context;

  // Extract config values with defaults
  const backgroundColor =
    animation?.backgroundColor?.value ??
    (isDark ? DEFAULT_HIGHLIGHT_COLOR_DARK : DEFAULT_HIGHLIGHT_COLOR_LIGHT);
  const opacityValue = animation?.opacity?.value ?? DEFAULT_HIGHLIGHT_OPACITY;
  const opacityTimingConfig = {
    duration: animation?.opacity?.timingConfig?.duration ?? 200,
  };

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor,
    opacity: withTiming(isPressed.get() ? opacityValue[1] : opacityValue[0], opacityTimingConfig),
  }));

  return { overlayStyle };
}

/**
 * Animation hook for PressableFeedback ripple effect
 * Handles ripple circle animation with position-based expansion
 */
export function usePressableFeedbackRippleAnimation(
  context: PressableFeedbackContextValue,
  options?: {
    animation?: RippleAnimationConfig;
    isDark?: boolean;
  },
): RippleAnimationResult {
  const { animation, isDark = false } = options ?? {};
  const { containerWidth, containerHeight, pressedCenterX, pressedCenterY } = context;

  // Local isPressed for ripple (separate from root for proper timing)
  const isPressed = useSharedValue(false);
  const rippleProgress = useSharedValue(0);

  // Extract config values with defaults
  const baseDuration = animation?.progress?.baseDuration ?? BASE_RIPPLE_PROGRESS_DURATION;
  const minBaseDuration = animation?.progress?.minBaseDuration ?? BASE_RIPPLE_PROGRESS_DURATION_MIN;
  const ignoreDurationCoefficient = animation?.progress?.ignoreDurationCoefficient ?? false;

  const backgroundColor =
    animation?.backgroundColor?.value ??
    (isDark ? DEFAULT_HIGHLIGHT_COLOR_DARK : DEFAULT_HIGHLIGHT_COLOR_LIGHT);
  const opacityValue = animation?.opacity?.value ?? DEFAULT_RIPPLE_OPACITY;
  const scaleValue = animation?.scale?.value ?? DEFAULT_RIPPLE_SCALE;

  // Calculate duration based on container diagonal
  const durationCoefficient = useDerivedValue(() => {
    if (ignoreDurationCoefficient) return 1;

    const baseDiagonal = 450;
    const currentDiagonal = Math.sqrt(containerWidth.get() ** 2 + containerHeight.get() ** 2);
    return currentDiagonal > 0 ? currentDiagonal / baseDiagonal : 1;
  });

  const getAdjustedDuration = useCallback(() => {
    'worklet';
    return Math.min(
      Math.max(baseDuration * durationCoefficient.get(), minBaseDuration),
      baseDuration * 2,
    );
  }, [baseDuration, minBaseDuration, durationCoefficient]);

  // Start ripple animation when pressed
  useAnimatedReaction(
    () => isPressed.get(),
    (isPressedValue) => {
      if (isPressedValue && rippleProgress.get() === 0) {
        const adjustedDuration = Math.min(
          Math.max(baseDuration * durationCoefficient.get(), minBaseDuration),
          baseDuration * 2,
        );
        rippleProgress.set(withTiming(1, { duration: adjustedDuration }));
      }
    },
  );

  const onTouchStart = useCallback(
    (e: GestureResponderEvent) => {
      isPressed.set(true);
      pressedCenterX.set(e.nativeEvent.locationX);
      pressedCenterY.set(e.nativeEvent.locationY);
      rippleProgress.set(0);
    },
    [isPressed, pressedCenterX, pressedCenterY, rippleProgress],
  );

  const onTouchEnd = useCallback(() => {
    isPressed.set(false);
    const adjustedDuration = getAdjustedDuration();
    rippleProgress.set(withTiming(2, { duration: adjustedDuration }));
  }, [isPressed, rippleProgress, getAdjustedDuration]);

  const rippleStyle = useAnimatedStyle(() => {
    // Calculate circle radius to cover entire container
    const circleRadius = Math.sqrt(containerWidth.get() ** 2 + containerHeight.get() ** 2) * 1.25;

    const translateX = pressedCenterX.get() - circleRadius;
    const translateY = pressedCenterY.get() - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: interpolate(
        rippleProgress.get(),
        [0, 1, 2],
        [opacityValue[0], opacityValue[1], opacityValue[2]],
      ),
      transform: [
        { translateX },
        { translateY },
        {
          scale: interpolate(
            rippleProgress.get(),
            [0, 1, 2],
            [scaleValue[0], scaleValue[1], scaleValue[2]],
          ),
        },
      ],
    };
  });

  return {
    rippleStyle,
    backgroundColor,
    onTouchStart,
    onTouchEnd,
  };
}
