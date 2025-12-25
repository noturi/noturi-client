import { Switch as RNSwitch, View } from 'react-native';

import { Typography } from './typography';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, checked, onCheckedChange, disabled = false }: SwitchProps) {
  const switchElement = (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{ false: '#e0e0e0', true: '#1d1d1d' }}
      thumbColor="#ffffff"
    />
  );

  if (!label) {
    return switchElement;
  }

  return (
    <View className="flex-row items-center justify-between">
      <Typography variant="footnote">{label}</Typography>
      {switchElement}
    </View>
  );
}
