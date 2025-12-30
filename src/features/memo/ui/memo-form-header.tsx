import { X } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  const { hexColors } = useUserTheme();

  return (
    <View
      className="h-11 flex-row items-center justify-center px-4"
      style={{
        backgroundColor: hexColors.bgPrimary,
        borderBottomColor: hexColors.border,
        borderBottomWidth: 0.5,
      }}
    >
      <Pressable
        className="absolute left-4 h-11 w-11 items-center justify-center rounded-2"
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        onPress={onClose}
      >
        <X color={hexColors.primary} size={20} strokeWidth={2} />
      </Pressable>

      <Typography className="font-semibold text-text-primary" variant="headline">
        새 메모
      </Typography>
    </View>
  );
};
