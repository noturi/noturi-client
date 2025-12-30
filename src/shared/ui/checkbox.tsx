import { Check } from 'lucide-react-native';

import { Pressable, View } from 'react-native';

import { Typography } from './typography';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onCheckedChange, disabled = false }: CheckboxProps) {
  return (
    <Pressable
      className={`flex-row items-center gap-2 ${disabled ? 'opacity-60' : ''}`}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
    >
      <View
        className={`w-5 h-5 rounded-1 border-2 items-center justify-center ${
          checked ? 'bg-primary border-primary' : 'bg-transparent border-border'
        }`}
      >
        {checked && <Check color="white" size={14} />}
      </View>
      {label && (
        <Typography className="text-text-secondary" variant="footnote">
          {label}
        </Typography>
      )}
    </Pressable>
  );
}
