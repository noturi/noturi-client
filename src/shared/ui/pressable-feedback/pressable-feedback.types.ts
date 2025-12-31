import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';

// Animation timing config
export interface TimingConfig {
  duration?: number;
}

// Root animation config
export interface RootScaleAnimationConfig {
  value?: number;
  timingConfig?: TimingConfig;
  ignoreScaleCoefficient?: boolean;
}

export interface RootAnimationConfig {
  scale?: RootScaleAnimationConfig;
}

// Highlight animation config
export interface HighlightAnimationConfig {
  backgroundColor?: {
    value?: string;
  };
  opacity?: {
    value?: [number, number];
    timingConfig?: TimingConfig;
  };
}

// Ripple animation config
export interface RippleProgressConfig {
  baseDuration?: number;
  minBaseDuration?: number;
  ignoreDurationCoefficient?: boolean;
}

export interface RippleAnimationConfig {
  backgroundColor?: {
    value?: string;
  };
  opacity?: {
    value?: [number, number, number];
  };
  scale?: {
    value?: [number, number, number];
  };
  progress?: RippleProgressConfig;
}

// Component props
export interface PressableFeedbackHighlightProps {
  animation?: HighlightAnimationConfig;
  style?: ViewStyle | AnimatedStyle<ViewStyle>;
}

export interface PressableFeedbackRippleProps {
  animation?: RippleAnimationConfig;
  style?: ViewStyle | AnimatedStyle<ViewStyle>;
}

export interface PressableFeedbackRootProps extends Omit<PressableProps, 'style'> {
  children?: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  isDisabled?: boolean;
  animation?: RootAnimationConfig;
}

// Context value for sharing animation state between root and children
export interface PressableFeedbackContextValue {
  isPressed: SharedValue<boolean>;
  containerWidth: SharedValue<number>;
  containerHeight: SharedValue<number>;
  pressedCenterX: SharedValue<number>;
  pressedCenterY: SharedValue<number>;
}

// Animation hook return types
export interface RootAnimationResult {
  containerStyle: AnimatedStyle<ViewStyle>;
  onPressIn: (e: GestureResponderEvent) => void;
  onPressOut: (e: GestureResponderEvent) => void;
  onLayout: (e: LayoutChangeEvent) => void;
  contextValue: PressableFeedbackContextValue;
}

export interface HighlightAnimationResult {
  overlayStyle: AnimatedStyle<ViewStyle>;
}

export interface RippleAnimationResult {
  rippleStyle: AnimatedStyle<ViewStyle>;
  backgroundColor: string;
  onTouchStart: (e: GestureResponderEvent) => void;
  onTouchEnd: () => void;
}
