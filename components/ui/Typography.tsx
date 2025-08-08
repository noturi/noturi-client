import { H1, H2, H3, H4, H5, Paragraph, SizableText } from 'tamagui';

import React from 'react';

export type TypographyVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'small'
  | 'caption'
  | 'link'
  | 'label';

const getComponentByVariant = (variant: TypographyVariant) => {
  switch (variant) {
    case 'display':
      return H1; // 가장 큰 제목 → h1
    case 'heading':
      return H2; // 페이지 제목 → h2
    case 'subheading':
      return H3; // 섹션 제목 → h3
    case 'title':
      return H4; // 카드 제목 → h4
    case 'subtitle':
      return H5; // 작은 제목 → h5
    case 'body':
      return Paragraph; // 본문 → p
    case 'small':
    case 'caption':
    case 'link':
    case 'label':
    default:
      return SizableText;
  }
};

// 스타일 맵핑
const variantStyles = {
  display: {
    fontSize: '$8', // 24px
    fontWeight: '$5', // 700
    lineHeight: '$8',
    color: '$textPrimary',
  },
  heading: {
    fontSize: '$7', // 20px
    fontWeight: '$4', // 600
    lineHeight: '$7',
    color: '$textPrimary',
  },
  subheading: {
    fontSize: '$5', // 16px
    fontWeight: '$4', // 600
    lineHeight: '$5',
    color: '$textPrimary',
  },
  title: {
    fontSize: '$4', // 14px
    fontWeight: '$4', // 600
    lineHeight: '$4',
    color: '$textPrimary',
  },
  subtitle: {
    fontSize: '$3', // 13px
    fontWeight: '$3', // 500
    lineHeight: '$3',
    color: '$textPrimary',
  },
  body: {
    fontSize: '$3', // 13px
    fontWeight: '$2', // 400
    lineHeight: '$3',
    color: '$textPrimary',
  },
  small: {
    fontSize: '$2', // 12px
    fontWeight: '$2', // 400
    lineHeight: '$2',
    color: '$textSecondary',
  },
  caption: {
    fontSize: '$1', // 11px
    fontWeight: '$2', // 400
    lineHeight: '$1',
    color: '$textMuted',
  },
  link: {
    fontSize: '$3', // 13px
    fontWeight: '$2', // 400
    lineHeight: '$3',
    color: '$accent',
    textDecorationLine: 'none',
  },
  label: {
    fontSize: '$2', // 12px
    fontWeight: '$3', // 500
    lineHeight: '$2',
    color: '$textPrimary',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
} as const;

export interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  [key: string]: any;
}

export const Typography = ({ variant = 'body', children, ...props }: TypographyProps) => {
  const Component = getComponentByVariant(variant);
  const styles = variantStyles[variant];

  return (
    <Component
      {...styles}
      margin={variant === 'body' ? 0 : undefined}
      pressStyle={variant === 'link' ? { opacity: 0.7 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};
