import { Switch as TamaguiSwitch, XStack } from 'tamagui';

import { Typography } from './typography';

export interface SwitchProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, checked, onCheckedChange, disabled = false }: SwitchProps) {
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Typography variant="footnote">{label}</Typography>
      <TamaguiSwitch
        backgroundColor={checked ? '$primary' : '$border'}
        checked={checked}
        disabled={disabled}
        size="$5"
        onCheckedChange={onCheckedChange}
      >
        <TamaguiSwitch.Thumb animation="quick" backgroundColor="white" />
      </TamaguiSwitch>
    </XStack>
  );
}
