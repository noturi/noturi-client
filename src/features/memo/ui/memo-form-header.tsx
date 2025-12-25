import { X } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  const { currentTheme } = useUserTheme();
  const bgColor = rgbToHex(currentTheme.colors.bgPrimary);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const primaryColor = rgbToHex(currentTheme.colors.primary);

  return (
    <View
      className="h-11 flex-row items-center justify-center px-4"
      style={{
        backgroundColor: bgColor,
        borderBottomColor: borderColor,
        borderBottomWidth: 0.5,
      }}
    >
      <Pressable
        className="absolute left-4 h-11 w-11 items-center justify-center rounded-2"
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        onPress={onClose}
      >
        <X color={primaryColor} size={20} strokeWidth={2} />
      </Pressable>

      <Typography className="font-semibold text-text-primary" variant="headline">
        새 메모
      </Typography>
    </View>
  );
};
