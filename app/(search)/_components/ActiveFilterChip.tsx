import { Button, XStack } from 'tamagui';

import { X } from '@tamagui/lucide-icons';

import { Typography } from '@/components/ui';

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  return (
    <XStack
      alignItems="center"
      backgroundColor="$primary"
      borderRadius="$3"
      gap="$1"
      paddingHorizontal="$3"
      paddingVertical="$1"
    >
      <Typography color="$textOnPrimary" variant="caption">
        {label}
      </Typography>
      <Button
        backgroundColor="$backgroundTransparent"
        color="$textOnPrimary"
        size="$1"
        onPress={onClear}
      >
        <X size={12} />
      </Button>
    </XStack>
  );
}
