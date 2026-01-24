import { useTheme } from '@react-navigation/native';

import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function CircularProgress({
  progress,
  size = 40,
  strokeWidth = 4,
  children,
}: CircularProgressProps) {
  const { colors } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height={size} style={{ position: 'absolute' }} width={size}>
        {/* 배경 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        {/* 진행률 원 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          r={radius}
          rotation={-90}
          stroke={colors.primary}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      {children}
    </View>
  );
}
