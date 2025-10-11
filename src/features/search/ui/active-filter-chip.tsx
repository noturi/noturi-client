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
      paddingHorizontal="$1"
      paddingVertical="$0"
      onPress={onClear}
    >
      <Typography color="$textPrimary" pointerEvents="none" variant="callout">
        {label}
      </Typography>
      <X color="$textPrimary" size="$2" />
    </Button>
  );
}
