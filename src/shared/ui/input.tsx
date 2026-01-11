import { forwardRef, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';

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

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { hasError = false, size = 'md', style, className, onFocus, onBlur, ...props },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
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
      placeholderTextColor="#9e9e9e"
      spellCheck={false}
      style={[sizeStyles[size], { textAlignVertical: 'center' }, style]}
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
});
