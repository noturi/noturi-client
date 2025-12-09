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
        unstyled
        backgroundColor={checked ? '$primary' : '$backgroundSecondary'}
        borderColor="transparent"
        borderWidth={0}
        checked={checked}
        disabled={disabled}
        size="$6"
        onCheckedChange={onCheckedChange}
      >
        <TamaguiSwitch.Thumb animation="quick" backgroundColor="white" />
      </TamaguiSwitch>
    </XStack>
  );
}
