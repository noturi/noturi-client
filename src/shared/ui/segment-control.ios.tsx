import { SegmentedControl } from '@expo/ui/community/segmented-control';

import { View } from 'react-native';

/** 칸 하나의 너비 — 한글 4~5자 + 좌우 여백. 화면 비율로 늘리면 짧은 라벨에 여백이 과하게 생김 */
const SEGMENT_WIDTH = 84;

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
    <View style={{ width: options.length * SEGMENT_WIDTH }}>
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
