import { Pressable, PressableProps, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import React from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'plain'
  | 'filled'
  | 'tinted'
  | 'ghost'
  | 'outlined';
export type ButtonSize = 'sm' | 'md' | 'lg' | '$2' | '$3' | '$4';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  // Tamagui 호환 props
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  color?: string;
  flex?: number;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary border-transparent',
  secondary: 'bg-transparent border-border',
  destructive: 'bg-error border-transparent',
  plain: 'bg-transparent border-transparent',
  filled: 'bg-bg-secondary border-transparent',
  tinted: 'bg-accent/20 border-transparent',
  ghost: 'bg-transparent border-border',
  outlined: 'bg-transparent border-border',
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: 'text-primary-text',
  secondary: 'text-accent',
  destructive: 'text-white',
  plain: 'text-accent',
  filled: 'text-text-primary',
  tinted: 'text-accent',
  ghost: 'text-text-primary',
  outlined: 'text-text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  md: 'h-11 px-4',
  lg: 'min-h-14 px-5',
  // Tamagui 호환 사이즈
  '$2': 'h-8 px-3',
  '$3': 'h-11 px-4',
  '$4': 'min-h-14 px-5',
};

const sizeTextStyles: Record<ButtonSize, { fontSize: number; fontFamily: string }> = {
  sm: { fontSize: 13, fontFamily: 'Pretendard-Regular' },
  md: { fontSize: 17, fontFamily: 'Pretendard-Regular' },
  lg: { fontSize: 17, fontFamily: 'Pretendard-SemiBold' },
  // Tamagui 호환 사이즈
  '$2': { fontSize: 13, fontFamily: 'Pretendard-Regular' },
  '$3': { fontSize: 17, fontFamily: 'Pretendard-Regular' },
  '$4': { fontSize: 17, fontFamily: 'Pretendard-SemiBold' },
};

// Tamagui 색상값을 실제 색상으로 변환
function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('$')) {
    const colorMap: Record<string, string> = {
      '$primary': '#1d1d1d',
      '$accent': '#ffc107',
      '$error': '#f44336',
      '$textPrimary': '#212121',
      '$textSecondary': '#757575',
      '$border': '#e0e0e0',
      '$backgroundPrimary': '#ffffff',
      '$backgroundSecondary': '#f5f5f5',
    };
    return colorMap[color] || color;
  }
  return color;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  disabled,
  onPressIn,
  onPressOut,
  style,
  // Tamagui 호환 props
  backgroundColor,
  borderColor,
  borderStyle: _borderStyle,
  borderWidth,
  color,
  flex,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 100 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    onPressOut?.(e);
  };

  // Tamagui 호환 스타일 생성
  const extraStyles: ViewStyle = {};
  if (backgroundColor) extraStyles.backgroundColor = resolveColor(backgroundColor);
  if (borderColor) extraStyles.borderColor = resolveColor(borderColor);
  if (borderWidth !== undefined) extraStyles.borderWidth = borderWidth;
  if (flex !== undefined) extraStyles.flex = flex;

  const resolvedTextColor = resolveColor(color);

  return (
    <AnimatedPressable
      style={[animatedStyle, extraStyles, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className={`
        flex-row items-center justify-center rounded-5 border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'flex-1 self-stretch' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      {...props}
    >
      {icon && <View className="mr-2">{icon}</View>}
      {typeof children === 'string' ? (
        <Text
          className={variantTextClasses[variant]}
          style={[
            sizeTextStyles[size],
            resolvedTextColor ? { color: resolvedTextColor } : undefined,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}
