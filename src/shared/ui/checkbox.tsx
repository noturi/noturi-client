import { Checkbox as TamaguiCheckbox, XStack } from 'tamagui';

import { Check } from '@tamagui/lucide-icons';

import { Typography } from './typography';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onCheckedChange, disabled = false }: CheckboxProps) {
  return (
    <XStack alignItems="center" gap="$2" opacity={disabled ? 0.6 : 1}>
      <TamaguiCheckbox
        backgroundColor={checked ? '$primary' : 'transparent'}
        borderColor={checked ? '$primary' : '$border'}
        borderWidth={2}
        checked={checked}
        disabled={disabled}
        size="$6"
        onCheckedChange={onCheckedChange}
      >
        <TamaguiCheckbox.Indicator>
          <Check color="white" size={14} />
        </TamaguiCheckbox.Indicator>
      </TamaguiCheckbox>
      {label && (
        <Typography
          color="$textSecondary"
          variant="footnote"
          onPress={() => !disabled && onCheckedChange(!checked)}
        >
          {label}
        </Typography>
      )}
    </XStack>
  );
}
