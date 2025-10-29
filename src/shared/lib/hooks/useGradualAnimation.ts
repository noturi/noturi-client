import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

const OFFSET = 42;

export const useGradualAnimation = () => {
  const totalOffset = OFFSET;

  const height = useSharedValue(totalOffset);

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';
        if (e.height > 0) {
          height.value = Math.max(e.height + OFFSET, totalOffset);
        }
      },
      onMove: (e) => {
        'worklet';
        height.value = e.height > 0 ? Math.max(e.height + OFFSET, totalOffset) : totalOffset;
      },
      onEnd: (e) => {
        'worklet';
        if (e.height === 0) {
          height.value = totalOffset;
        }
      },
    },
    [],
  );

  return { height };
};
