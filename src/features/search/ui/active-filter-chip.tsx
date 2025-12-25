import { X } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  const { currentTheme } = useUserTheme();
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textColor = rgbToHex(currentTheme.colors.textPrimary);

  return (
    <Pressable
      className="flex-row items-center rounded-7 px-2 py-1"
      style={{
        borderColor: borderColor,
        borderWidth: 1,
      }}
      onPress={onClear}
    >
      <Typography className="text-text-primary" variant="callout">
        {label}
      </Typography>
      <X color={textColor} size={14} />
    </Pressable>
  );
}
