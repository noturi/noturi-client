import { X } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  return (
    <View className="h-11 flex-row items-center justify-center bg-bg-primary border-b border-border px-4">
      <Pressable
        className="absolute left-4 h-11 w-11 items-center justify-center rounded-2"
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        onPress={onClose}
      >
        <X className="text-primary" size={20} strokeWidth={2} />
      </Pressable>

      <Typography className="font-semibold text-text-primary" variant="headline">
        새 메모
      </Typography>
    </View>
  );
};
