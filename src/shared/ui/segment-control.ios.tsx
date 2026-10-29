import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { controlSize, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

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
      <Host matchContents={{ vertical: true }}>
        {/* large: 통계 카드(StatCard)와 높이를 맞추기 위해 기본보다 한 단계 크게 */}
        <Picker
          label=""
          modifiers={[pickerStyle('segmented'), controlSize('large')]}
          selection={selectedIndex}
          onSelectionChange={(index) => {
            const option = options[index as number];
            if (option) onChange(option.value);
          }}
        >
          {options.map((option, index) => (
            <Text key={option.value} modifiers={[tag(index)]}>
              {option.label}
            </Text>
          ))}
        </Picker>
      </Host>
    </View>
  );
}
