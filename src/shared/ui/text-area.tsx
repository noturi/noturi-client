import { TextInput, TextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import React, { forwardRef, useState } from 'react';

type TextAreaSize = 'sm' | 'md' | 'lg';
type TextAreaVariant = 'default' | 'outlined';

export interface TextAreaProps extends TextInputProps {
  hasError?: boolean;
  size?: TextAreaSize;
  variant?: TextAreaVariant;
  // Tamagui 호환 props
  minHeight?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string | number;
  borderWidth?: number;
  paddingHorizontal?: string | number;
  paddingVertical?: string | number;
  fontSize?: string | number;
  color?: string;
}

const sizeStyles = {
  sm: { minHeight: 80, fontSize: 12 },
  md: { minHeight: 120, fontSize: 14 },
  lg: { minHeight: 160, fontSize: 16 },
};

// Tamagui 색상값을 실제 색상으로 변환
function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('$')) {
    const colorMap: Record<string, string> = {
      '$primary': '#1d1d1d',
      '$accent': '#ffc107',
      '$error': '#f44336',
      '$textPrimary': '#212121',
      '$textSecondary': '#757575',
      '$border': '#e0e0e0',
      '$backgroundPrimary': '#ffffff',
      '$backgroundSecondary': '#f5f5f5',
    };
    return colorMap[color] || color;
  }
  return color;
}

// Tamagui spacing 변환
function resolveSpacing(value?: string | number): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const spacingMap: Record<string, number> = {
    '$1': 2,
    '$2': 4,
    '$3': 8,
    '$4': 12,
    '$5': 16,
    '$6': 24,
    '$7': 32,
  };
  return spacingMap[value];
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  {
    hasError = false,
    size = 'md',
    variant = 'default',
    style,
    onFocus,
    onBlur,
    // Tamagui 호환 props
    minHeight,
    backgroundColor,
    borderColor,
    borderRadius,
    borderWidth,
    paddingHorizontal,
    paddingVertical,
    fontSize,
    color,
    ...props
  },
  ref
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

  const borderClass = hasError
    ? 'border-error'
    : isFocused
      ? 'border-primary'
      : 'border-border';

  const borderWidthClass = variant === 'default' ? 'border' : 'border-0';

  // Tamagui 호환 스타일 생성
  const extraStyles: ViewStyle & TextStyle = {};
  if (minHeight !== undefined) extraStyles.minHeight = minHeight;
  if (backgroundColor) extraStyles.backgroundColor = resolveColor(backgroundColor);
  if (borderColor) extraStyles.borderColor = resolveColor(borderColor);
  if (borderRadius !== undefined) extraStyles.borderRadius = resolveSpacing(borderRadius);
  if (borderWidth !== undefined) extraStyles.borderWidth = borderWidth;
  if (paddingHorizontal !== undefined) extraStyles.paddingHorizontal = resolveSpacing(paddingHorizontal);
  if (paddingVertical !== undefined) extraStyles.paddingVertical = resolveSpacing(paddingVertical);
  if (fontSize !== undefined) extraStyles.fontSize = resolveSpacing(fontSize);
  if (color) extraStyles.color = resolveColor(color);

  return (
    <TextInput
      ref={ref}
      className={`bg-bg-primary ${borderWidthClass} ${borderClass} rounded-5 px-2 py-3 text-text-primary`}
      style={[sizeStyles[size], styles.textArea, extraStyles, style]}
      placeholderTextColor="#9e9e9e"
      multiline
      textAlignVertical="top"
      autoCorrect={false}
      autoCapitalize="none"
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  textArea: {
    fontFamily: 'Pretendard-Regular',
  },
});
