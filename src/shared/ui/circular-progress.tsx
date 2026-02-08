import { useTheme } from '@react-navigation/native';

import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  progress,
  size = 40,
  strokeWidth = 4,
  trackColor,
  progressColor,
  children,
}: CircularProgressProps) {
  const { colors } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedProgress = useSharedValue(clampedProgress);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedProgress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedProgress.value / 100) * circumference,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height={size} style={{ position: 'absolute' }} width={size}>
        {/* 배경 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={trackColor ?? colors.border}
          strokeWidth={strokeWidth}
        />
        {/* 진행률 원 */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          r={radius}
          rotation={-90}
          stroke={progressColor ?? colors.primary}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      {children}
    </View>
  );
}
