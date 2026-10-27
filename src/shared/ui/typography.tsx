import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

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
// variant 자체가 타이포 토큰 — FONT_SIZE(text-1~7) 스케일과 별개로 iOS 값(fontSize/lineHeight)을 그대로 유지한다
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
  // 통계 값 — 옆 라벨(footnote)과 같은 크기, 굵기로 강조
  number: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 18,
    letterSpacing: -0.08,
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
  // accent(노랑)는 흰 배경 대비가 낮아(약 1.6:1) 글자색으로 쓰지 않음
  number: 'text-text-primary',
};

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const fontFamilyMap: Record<FontWeight, string> = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
};

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  weight?: FontWeight;
}

export function Typography({
  variant = 'body',
  children,
  style,
  className,
  weight,
  ...props
}: TypographyProps) {
  const baseStyle = variantStyles[variant];
  const colorClass = variantColorClass[variant];
  const fontFamily = weight ? fontFamilyMap[weight] : undefined;

  return (
    <Text
      className={`${colorClass} ${className ?? ''}`}
      style={[baseStyle, fontFamily && { fontFamily }, style] as StyleProp<TextStyle>}
      {...props}
    >
      {children}
    </Text>
  );
}
