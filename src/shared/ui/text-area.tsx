import { forwardRef, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';

export interface TextAreaProps extends TextInputProps {
  hasError?: boolean;
  minHeight?: number;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { hasError = false, minHeight = 120, style, className, onFocus, onBlur, ...props },
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
      multiline
      autoCapitalize="none"
      autoCorrect={false}
      className={`border bg-bg-primary ${borderClass} rounded-5 px-3 py-3 font-sans text-text-primary ${className ?? ''}`}
      placeholderTextColor="#9e9e9e"
      style={[{ minHeight }, style]}
      textAlignVertical="top"
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
});
