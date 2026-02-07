import { Check } from 'lucide-react-native';

import Animated from 'react-native-reanimated';

interface TodoCheckboxProps {
  isCompleted: boolean;
  circleStyle: Animated.AnimateStyle<Record<string, unknown>>;
  checkStyle: Animated.AnimateStyle<Record<string, unknown>>;
}

/**
 * 투두 체크박스 - 애니메이션 원 + 체크 아이콘
 * SRP: 체크박스 시각적 표현만 담당
 */
export function TodoCheckbox({ isCompleted, circleStyle, checkStyle }: TodoCheckboxProps) {
  return (
    <Animated.View
      className={`items-center justify-center rounded-full border-2 ${
        isCompleted ? 'border-primary bg-primary' : 'border-border'
      }`}
      style={[{ width: 24, height: 24 }, circleStyle]}
    >
      <Animated.View style={checkStyle}>
        {isCompleted && <Check color="#fff" size={14} strokeWidth={3} />}
      </Animated.View>
    </Animated.View>
  );
}
