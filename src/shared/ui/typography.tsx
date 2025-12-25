import { Text, TextProps, TextStyle, StyleProp } from 'react-native';

import React from 'react';

export type TypographyVariant =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption1'
  | 'caption2'
  | 'link'
  | 'label'
  | 'number';

// iOS Typography Scale - https://developer.apple.com/design/human-interface-guidelines/typography
const variantStyles: Record<TypographyVariant, TextStyle> = {
  largeTitle: {
    fontSize: 34,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: 28,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  headline: {
    fontSize: 17,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  subheadline: {
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  caption1: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 16,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 13,
    letterSpacing: 0.07,
  },
  link: {
    fontSize: 17,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 13,
    letterSpacing: 0.07,
    textTransform: 'uppercase',
  },
  number: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
};

// 기본 색상 클래스 매핑
const variantColorClass: Record<TypographyVariant, string> = {
  largeTitle: 'text-text-primary',
  title1: 'text-text-primary',
  title2: 'text-text-primary',
  title3: 'text-text-primary',
  headline: 'text-text-primary',
  body: 'text-text-primary',
  callout: 'text-text-primary',
  subheadline: 'text-text-primary',
  footnote: 'text-text-primary',
  caption1: 'text-text-secondary',
  caption2: 'text-text-muted',
  link: 'text-accent',
  label: 'text-text-primary',
  number: 'text-[#2196f3]',
};

// Tamagui 색상값을 실제 색상으로 변환
function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('$')) {
    const colorMap: Record<string, string> = {
      '$textPrimary': '#212121',
      '$textSecondary': '#757575',
      '$textMuted': '#9e9e9e',
      '$accent': '#ffc107',
      '$primary': '#1d1d1d',
      '$error': '#f44336',
      '$star': '#ffc107',
      '$rating1': '#ff6b35',
      '$rating2': '#ffa726',
      '$rating3': '#9ccc65',
      '$rating4': '#66bb6a',
      '$rating5': '#42a5f5',
    };
    return colorMap[color] || color;
  }
  return color;
}

// Tamagui fontWeight 변환
function resolveFontWeight(fontWeight?: string | number): string | undefined {
  if (!fontWeight) return undefined;
  const weightMap: Record<string, string> = {
    '$4': 'Pretendard-Regular',
    '$5': 'Pretendard-Medium',
    '$6': 'Pretendard-SemiBold',
    '600': 'Pretendard-SemiBold',
    '500': 'Pretendard-Medium',
    '400': 'Pretendard-Regular',
  };
  return weightMap[String(fontWeight)];
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

// Tamagui fontSize 변환
function resolveFontSize(value?: string | number): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const sizeMap: Record<string, number> = {
    '$1': 11,
    '$2': 12,
    '$3': 13,
    '$4': 14,
    '$5': 17,
    '$6': 20,
    '$7': 24,
    '$8': 28,
  };
  return sizeMap[value];
}

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  color?: string;
  // Tamagui 호환 props
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  paddingTop?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  paddingVertical?: string | number;
  paddingHorizontal?: string | number;
  fontWeight?: string | number;
  textAlign?: TextStyle['textAlign'] | string;
  fontSize?: string | number;
  lineHeight?: string | number;
  flex?: number;
  maxWidth?: number;
  opacity?: number;
  textDecorationLine?: TextStyle['textDecorationLine'];
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
  // deprecated props (ignored)
  pressable?: boolean;
  as?: string;
  size?: string;
}

export const Typography = ({
  variant = 'body',
  children,
  style,
  color,
  className,
  // Tamagui 호환 props
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingVertical,
  paddingHorizontal,
  fontWeight,
  textAlign,
  fontSize,
  lineHeight,
  flex,
  maxWidth,
  opacity,
  textDecorationLine,
  pointerEvents,
  // ignored props
  pressable: _pressable,
  as: _as,
  size: _size,
  ...props
}: TypographyProps) => {
  const baseStyle = variantStyles[variant];
  const colorClass = variantColorClass[variant];
  const resolvedColor = resolveColor(color);
  const resolvedFontFamily = resolveFontWeight(fontWeight);

  // 추가 스타일 생성
  const extraStyles: TextStyle = {};
  if (resolvedColor) extraStyles.color = resolvedColor;
  if (resolvedFontFamily) extraStyles.fontFamily = resolvedFontFamily;
  if (textAlign) extraStyles.textAlign = textAlign as TextStyle['textAlign'];
  if (fontSize !== undefined) extraStyles.fontSize = resolveFontSize(fontSize);
  if (lineHeight !== undefined) extraStyles.lineHeight = resolveSpacing(lineHeight);
  if (marginTop !== undefined) extraStyles.marginTop = resolveSpacing(marginTop);
  if (marginBottom !== undefined) extraStyles.marginBottom = resolveSpacing(marginBottom);
  if (marginLeft !== undefined) extraStyles.marginLeft = resolveSpacing(marginLeft);
  if (marginRight !== undefined) extraStyles.marginRight = resolveSpacing(marginRight);
  if (paddingTop !== undefined) extraStyles.paddingTop = resolveSpacing(paddingTop);
  if (paddingBottom !== undefined) extraStyles.paddingBottom = resolveSpacing(paddingBottom);
  if (paddingLeft !== undefined) extraStyles.paddingLeft = resolveSpacing(paddingLeft);
  if (paddingRight !== undefined) extraStyles.paddingRight = resolveSpacing(paddingRight);
  if (paddingVertical !== undefined) extraStyles.paddingVertical = resolveSpacing(paddingVertical);
  if (paddingHorizontal !== undefined) extraStyles.paddingHorizontal = resolveSpacing(paddingHorizontal);
  if (flex !== undefined) extraStyles.flex = flex;
  if (maxWidth !== undefined) extraStyles.maxWidth = maxWidth;
  if (opacity !== undefined) extraStyles.opacity = opacity;
  if (textDecorationLine) extraStyles.textDecorationLine = textDecorationLine;

  return (
    <Text
      className={`${colorClass} ${className ?? ''}`}
      style={[baseStyle, extraStyles, style] as StyleProp<TextStyle>}
      pointerEvents={pointerEvents}
      {...props}
    >
      {children}
    </Text>
  );
};
