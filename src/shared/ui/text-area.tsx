import { useThemeColor } from '~/shared/lib/theme-context';

import { type Ref, useState } from 'react';
import { TextInput, type TextInputInstance, TextInputProps } from 'react-native';

type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

export interface TextAreaProps extends TextInputProps {
  hasError?: boolean;
  minHeight?: number;
}

export function TextArea({
  ref,
  hasError = false,
  minHeight = 120,
  style,
  className,
  onFocus,
  onBlur,
  ...props
}: TextAreaProps & { ref?: Ref<TextInputInstance> }) {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderColor = useThemeColor('textMuted');

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
      multiline
      autoCapitalize="none"
      autoCorrect={false}
      className={`border bg-bg-primary ${borderClass} rounded-5 px-3 py-3 font-sans text-text-primary ${className ?? ''}`}
      placeholderTextColor={placeholderColor}
      style={[{ minHeight }, style]}
      textAlignVertical="top"
      onBlur={handleBlur}
      onFocus={handleFocus}
      {...props}
    />
  );
}
