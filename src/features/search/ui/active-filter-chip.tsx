import { X } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  const { hexColors } = useUserTheme();

  return (
    <Pressable
      className="flex-row items-center rounded-7 px-2 py-1"
      style={{
        borderColor: hexColors.border,
        borderWidth: 1,
      }}
      onPress={onClear}
    >
      <Typography className="text-text-primary" variant="callout">
        {label}
      </Typography>
      <X color={hexColors.textPrimary} size={14} />
    </Pressable>
  );
}
