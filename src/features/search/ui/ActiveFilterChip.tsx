import { Button } from 'tamagui';
import { Typography } from '~/shared/ui';

import { X } from '@tamagui/lucide-icons';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  return (
    <Button
      unstyled
      alignItems="center"
      backgroundColor="$backgroundTransparent"
      borderColor="$border"
      borderRadius="$7"
      borderWidth={1}
      flexDirection="row"
      paddingHorizontal="$2"
      paddingVertical="$1"
      onPress={onClear}
    >
      <Typography color="$textPrimary" pointerEvents="none" variant="subtitle">
        {label}
      </Typography>
      <X color="$textPrimary" size={12} />
    </Button>
  );
}
