import { useUserTheme } from '~/shared/lib/theme-context';

import { useState } from 'react';
import { Platform, Switch as RNSwitch, View } from 'react-native';

import { Typography } from './typography';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

// iOS 스위치는 기본 크기가 커서 축소해 사용
const IOS_SCALE = 0.75;

export function Switch({ label, checked, onCheckedChange, disabled = false }: SwitchProps) {
  const { hexColors, isDark } = useUserTheme();
  // transform은 보이는 크기만 줄이고 레이아웃 공간은 원래 크기로 남겨 주변에 빈 여백이 생김
  // → 실제 크기를 측정해 줄어든 만큼 음수 마진으로 당김 (iOS 버전마다 기본 크기가 달라 고정값 불가)
  const [nativeSize, setNativeSize] = useState<{ width: number; height: number } | null>(null);
  const iosStyle =
    Platform.OS === 'ios'
      ? {
          transform: [{ scale: IOS_SCALE }],
          ...(nativeSize && {
            marginHorizontal: -(nativeSize.width * (1 - IOS_SCALE)) / 2,
            marginVertical: -(nativeSize.height * (1 - IOS_SCALE)) / 2,
          }),
        }
      : undefined;

  // 라이트: 진한 색(primary), 다크: 밝은 색(textSecondary)
  const activeTrackColor = isDark ? hexColors.textSecondary : hexColors.primary;

  const switchElement = (
    <RNSwitch
      disabled={disabled}
      ios_backgroundColor={hexColors.border}
      style={iosStyle}
      thumbColor={
        Platform.OS === 'android' ? (checked ? activeTrackColor : hexColors.surface) : undefined
      }
      trackColor={{ false: hexColors.border, true: activeTrackColor }}
      value={checked}
      onLayout={
        Platform.OS === 'ios' && !nativeSize
          ? (e) => setNativeSize(e.nativeEvent.layout)
          : undefined
      }
      onValueChange={onCheckedChange}
    />
  );

  if (!label) {
    return switchElement;
  }

  return (
    <View className="flex-row items-center justify-between">
      <Typography variant="footnote">{label}</Typography>
      {switchElement}
    </View>
  );
}
