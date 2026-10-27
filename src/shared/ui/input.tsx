import { useUserTheme } from '~/shared/lib/theme-context';

import { type Ref, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';

type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends TextInputProps {
  hasError?: boolean;
  size?: InputSize;
}

const sizeStyles = {
  sm: { height: 28, fontSize: 12 },
  md: { height: 36, fontSize: 14 },
  lg: { height: 44, fontSize: 16 },
};

export function Input({
  ref,
  hasError = false,
  size = 'md',
  style,
  className,
  onFocus,
  onBlur,
  ...props
}: InputProps & { ref?: Ref<TextInput> }) {
  const { hexColors } = useUserTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: FocusEvent) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: BlurEvent) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderClass = hasError ? 'border-error' : isFocused ? 'border-primary' : 'border-border';

  return (
    <TextInput
      ref={ref}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      className={`border bg-bg-primary ${borderClass} rounded-5 px-3 font-sans-medium text-text-primary ${className ?? ''}`}
      placeholderTextColor={hexColors.textMuted}
      spellCheck={false}
      style={[sizeStyles[size], { textAlignVertical: 'center' }, style]}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
