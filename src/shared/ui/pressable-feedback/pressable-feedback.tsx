import { useThemeColor } from '~/shared/lib/theme-context';

import { type Ref, createContext, use } from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  type ViewInstance,
} from 'react-native';
import Animated from 'react-native-reanimated';

import {
  usePressableFeedbackHighlightAnimation,
  usePressableFeedbackRippleAnimation,
  usePressableFeedbackRootAnimation,
} from './pressable-feedback.animation';
import { DISPLAY_NAME } from './pressable-feedback.constants';
import type {
  PressableFeedbackContextValue,
  PressableFeedbackHighlightProps,
  PressableFeedbackRippleProps,
  PressableFeedbackRootProps,
} from './pressable-feedback.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Context - using null as initial value since it must be within provider
const PressableFeedbackContext = createContext<PressableFeedbackContextValue | null>(null);

const usePressableFeedback = () => {
  const context = use(PressableFeedbackContext);
  if (!context) {
    throw new Error('PressableFeedback components must be used within PressableFeedback');
  }
  return context;
};

// Root Component
const PressableFeedbackRoot = ({
  ref,
  ...props
}: PressableFeedbackRootProps & { ref?: Ref<ViewInstance> }) => {
  const {
    children,
    className,
    style,
    isDisabled = false,
    animation,
    onPressIn: onPressInProp,
    onPressOut: onPressOutProp,
    ...restProps
  } = props;

  const { containerStyle, onPressIn, onPressOut, onLayout, contextValue } =
    usePressableFeedbackRootAnimation({ animation });

  const handlePressIn = (e: GestureResponderEvent) => {
    onPressIn(e);
    onPressInProp?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    onPressOut(e);
    onPressOutProp?.(e);
  };

  return (
    <PressableFeedbackContext value={contextValue}>
      <AnimatedPressable
        ref={ref}
        className={className}
        disabled={isDisabled}
        style={[styles.root, containerStyle, style]}
        onLayout={onLayout}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...restProps}
      >
        {children}
      </AnimatedPressable>
    </PressableFeedbackContext>
  );
};

// Highlight Effect Component
const PressableFeedbackHighlight = ({ animation, style }: PressableFeedbackHighlightProps) => {
  const context = usePressableFeedback();
  const defaultColor = useThemeColor('pressHighlight');
  const { overlayStyle } = usePressableFeedbackHighlightAnimation(context, {
    animation,
    defaultColor,
  });

  return <Animated.View pointerEvents="none" style={[styles.overlay, overlayStyle, style]} />;
};

// Ripple Effect Component
const PressableFeedbackRipple = ({ animation, style }: PressableFeedbackRippleProps) => {
  const context = usePressableFeedback();
  const defaultColor = useThemeColor('pressHighlight');
  const { rippleStyle, backgroundColor } = usePressableFeedbackRippleAnimation(context, {
    animation,
    defaultColor,
  });

  return (
    <View pointerEvents="none" style={styles.rippleContainer}>
      <Animated.View style={[styles.rippleCircle, { backgroundColor }, rippleStyle, style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  rippleContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  rippleCircle: {
    position: 'absolute',
  },
});

PressableFeedbackRoot.displayName = DISPLAY_NAME.ROOT;
PressableFeedbackHighlight.displayName = DISPLAY_NAME.HIGHLIGHT;
PressableFeedbackRipple.displayName = DISPLAY_NAME.RIPPLE;

/**
 * Compound PressableFeedback component with advanced animations
 *
 * @example
 * // With highlight effect
 * <PressableFeedback onPress={handlePress}>
 *   <PressableFeedback.Highlight />
 *   <Text>Press me</Text>
 * </PressableFeedback>
 *
 * @example
 * // With ripple effect
 * <PressableFeedback onPress={handlePress}>
 *   <PressableFeedback.Ripple />
 *   <Text>Press me</Text>
 * </PressableFeedback>
 *
 * @example
 * // Custom animation config
 * <PressableFeedback
 *   animation={{ scale: { value: 0.95 } }}
 *   onPress={handlePress}
 * >
 *   <PressableFeedback.Highlight
 *     animation={{
 *       backgroundColor: { value: '#ff0000' },
 *       opacity: { value: [0, 0.2] }
 *     }}
 *   />
 *   <Text>Press me</Text>
 * </PressableFeedback>
 */
const PressableFeedback = Object.assign(PressableFeedbackRoot, {
  Highlight: PressableFeedbackHighlight,
  Ripple: PressableFeedbackRipple,
});

export { usePressableFeedback };
export default PressableFeedback;
