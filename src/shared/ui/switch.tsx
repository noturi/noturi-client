import { useUserTheme } from '~/application/providers/theme-provider';

import { Platform, Switch as RNSwitch, View } from 'react-native';

import { Typography } from './typography';

export interface SwitchProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, checked, onCheckedChange, disabled = false }: SwitchProps) {
  const { hexColors } = useUserTheme();

  const switchElement = (
    <RNSwitch
      disabled={disabled}
      ios_backgroundColor={hexColors.border}
      style={Platform.OS === 'ios' ? { transform: [{ scale: 0.75 }] } : undefined}
      thumbColor={Platform.OS === 'android' ? (checked ? hexColors.accent : '#f4f4f4') : undefined}
      trackColor={{ false: hexColors.border, true: hexColors.accent }}
      value={checked}
      onValueChange={onCheckedChange}
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
