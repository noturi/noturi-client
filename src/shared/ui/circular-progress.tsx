import { DURATION } from '~/shared/config';
import { EASING } from '~/shared/lib/easing';
import { useThemeColor } from '~/shared/lib/theme-context';

import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
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
  const [borderColor, primaryColor] = useThemeColor(['border', 'primary']);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedProgress = useSharedValue(clampedProgress);

  useEffect(() => {
    animatedProgress.set(
      withTiming(clampedProgress, {
        duration: DURATION.progress,
        easing: EASING.outCubic,
      }),
    );
  }, [clampedProgress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedProgress.get() / 100) * circumference,
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
          stroke={trackColor ?? borderColor}
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
          stroke={progressColor ?? primaryColor}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      {children}
    </View>
  );
}
