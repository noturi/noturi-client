import { Switch as TamaguiSwitch, XStack } from 'tamagui';

import { Typography } from './typography';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, checked, onCheckedChange, disabled = false }: SwitchProps) {
  const switchElement = (
    <TamaguiSwitch
      backgroundColor={checked ? '$primary' : '$backgroundSecondary'}
      borderColor={checked ? '$primary' : '$border'}
      checked={checked}
      disabled={disabled}
      size="$5"
      onCheckedChange={onCheckedChange}
    >
      <TamaguiSwitch.Thumb animation="quick" backgroundColor="white" borderWidth={0} />
    </TamaguiSwitch>
  );

  if (!label) {
    return switchElement;
  }

  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Typography variant="footnote">{label}</Typography>
      {switchElement}
    </XStack>
  );
}
