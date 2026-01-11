import { X } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Pressable } from 'react-native';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  return (
    <Pressable
      className="flex-row items-center rounded-7 border border-border px-2 py-1"
      onPress={onClear}
    >
      <Typography className="text-text-primary" variant="callout">
        {label}
      </Typography>
      <X className="text-text-primary" size={14} />
    </Pressable>
  );
}
