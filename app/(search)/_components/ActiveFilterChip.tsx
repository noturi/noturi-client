import { Typography } from "@/components/ui";
import { X } from "@tamagui/lucide-icons";
import { Button, XStack } from "tamagui";

interface ActiveFilterChipProps {
  label: string;
  onClear: () => void;
}

export function ActiveFilterChip({ label, onClear }: ActiveFilterChipProps) {
  return (
    <XStack
      backgroundColor="$primary"
      paddingHorizontal="$3"
      paddingVertical="$1"
      borderRadius="$3"
      alignItems="center"
      gap="$1"
    >
      <Typography variant="caption" color="$textOnPrimary">
        {label}
      </Typography>
      <Button
        size="$1"
        backgroundColor="$backgroundTransparent"
        color="$textOnPrimary"
        onPress={onClear}
      >
        <X size={12} />
      </Button>
    </XStack>
  );
}
