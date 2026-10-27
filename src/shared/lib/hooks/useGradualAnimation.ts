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
          height.set(Math.max(e.height + OFFSET, totalOffset));
        }
      },
      onMove: (e) => {
        'worklet';
        height.set(e.height > 0 ? Math.max(e.height + OFFSET, totalOffset) : totalOffset);
      },
      onEnd: (e) => {
        'worklet';
        if (e.height === 0) {
          height.set(totalOffset);
        }
      },
    },
    [],
  );

  return { height };
};
