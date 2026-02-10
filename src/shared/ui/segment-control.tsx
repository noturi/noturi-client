import { useThemeColor } from '~/application/providers/theme-provider';

import { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, Platform, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Typography } from './typography';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const INDICATOR_MARGIN = 4;

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  const bgSecondaryColor = useThemeColor('bgSecondary');
  const borderColor = useThemeColor('border');
  const activeIndex = options.findIndex((o) => o.value === value);

  const innerWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  const getSegmentWidth = useCallback((w: number) => w / options.length, [options.length]);

  useEffect(() => {
    const sw = getSegmentWidth(innerWidth.value);
    translateX.value = withTiming(activeIndex * sw, { duration: 200 });
  }, [activeIndex, innerWidth.value, translateX, getSegmentWidth]);

  const handleInnerLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    innerWidth.value = width;
    translateX.value = activeIndex * getSegmentWidth(width);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const sw = innerWidth.value / options.length;
    return {
      position: 'absolute' as const,
      left: INDICATOR_MARGIN,
      top: INDICATOR_MARGIN,
      bottom: INDICATOR_MARGIN,
      width: sw - INDICATOR_MARGIN * 2,
      borderRadius: 22,
      borderWidth: 1,
      borderColor,
      backgroundColor: bgSecondaryColor,
      transform: [{ translateX: translateX.value }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.08,
      shadowRadius: 1,
      ...(Platform.OS === 'android' ? { elevation: 1 } : {}),
    };
  });

  return (
    <View className="w-3/5 rounded-full bg-surface p-1">
      <View className="flex-row" onLayout={handleInnerLayout}>
        <Animated.View style={indicatorStyle} />
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Pressable key={option.value} className="flex-1" onPress={() => onChange(option.value)}>
              <View className="items-center py-3.5">
                <Typography
                  className={isActive ? 'text-text-primary font-semibold' : 'text-text-muted'}
                  variant="subheadline"
                >
                  {option.label}
                </Typography>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
