import { SegmentedControl } from '@expo/ui/community/segmented-control';

import { View } from 'react-native';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * iOS: 네이티브 세그먼트(SwiftUI Picker) — iOS 26에서 선택 표시가 Liquid Glass로 동작
 * props는 segment-control.tsx(Android/웹 커스텀 구현)와 동일
 */
export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <View className="w-3/5">
      <SegmentedControl
        selectedIndex={selectedIndex}
        values={options.map((option) => option.label)}
        onChange={({ nativeEvent }) => {
          const option = options[nativeEvent.selectedSegmentIndex];
          if (option) onChange(option.value);
        }}
      />
    </View>
  );
}
