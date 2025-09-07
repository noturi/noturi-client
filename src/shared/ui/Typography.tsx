import { H1, H2, H3, H4, H5, Paragraph, SizableText } from 'tamagui';

import React from 'react';

export type TypographyVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'title'
  | 'subtitle'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'caption1'
  | 'caption2'
  | 'link'
  | 'label';

const getComponentByVariant = (variant: TypographyVariant) => {
  switch (variant) {
    case 'display':
      return H1;
    case 'heading':
      return H2;
    case 'subheading':
      return H3;
    case 'title':
      return H4;
    case 'subtitle':
      return H5;
    case 'body1':
    case 'body2':
    case 'body3':
      return Paragraph;
    case 'caption1':
    case 'caption2':
    case 'link':
    case 'label':
    default:
      return SizableText;
  }
};

const variantStyles = {
  display: {
    fontSize: '$7', // 24px
    fontWeight: '$5', // 600 - semibold
    lineHeight: '$7', // 28px
    color: '$textPrimary',
  },
  heading: {
    fontSize: '$7', // 24px
    fontWeight: '$4', // 500 - medium
    lineHeight: '$7', // 28px
    color: '$textPrimary',
  },
  subheading: {
    fontSize: '$6', // 20px
    fontWeight: '$4', // 600 - semibold
    lineHeight: '$6', // 24px
    color: '$textPrimary',
  },
  title: {
    fontSize: '$5', // 18px
    fontWeight: '$6', // 700 - bold
    lineHeight: '$5', // 20px
    color: '$textPrimary',
  },
  subtitle: {
    fontSize: '$4', // 16px
    fontWeight: '$4', // 500 - medium
    lineHeight: '$4', // 18px
    color: '$textPrimary',
  },

  body1: {
    fontSize: '$5', // 18px
    fontWeight: '$2', // 300 - light
    lineHeight: '$5', // 20px
    color: '$textPrimary',
  },
  body2: {
    fontSize: '$4', // 16px
    fontWeight: '$2', // 300 - light
    lineHeight: '$4', // 18px
    color: '$textPrimary',
  },
  body3: {
    fontSize: 14, // 14px
    fontWeight: '$2', // 300 - light
    lineHeight: 16, // 16px
    color: '$textPrimary',
  },

  // 작은 텍스트들
  caption1: {
    fontSize: 14, // 14px
    fontWeight: '$2', // 300 - light
    lineHeight: 16, // 16px
    color: '$textSecondary',
  },
  caption2: {
    fontSize: '$2', // 12px
    fontWeight: '$2', // 300 - light
    lineHeight: '$2', // 14px
    color: '$textMuted',
  },

  // 특수 용도
  link: {
    fontSize: 14, // 14px
    fontWeight: '$2', // 300 - light
    lineHeight: 16, // 16px
    color: '$accent',
    textDecorationLine: 'none',
  },
  label: {
    fontSize: '$2', // 12px
    fontWeight: '$3', // 400 - regular
    lineHeight: '$2', // 14px
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

export const Typography = ({ variant = 'body1', children, ...props }: TypographyProps) => {
  const Component = getComponentByVariant(variant);
  const styles = variantStyles[variant];

  return (
    <Component
      {...props}
      {...styles}
      margin={variant === 'body1' || variant === 'body2' || variant === 'body3' ? 0 : undefined}
      pointerEvents="none"
      pressStyle={variant === 'link' ? { opacity: 0.7 } : undefined}
    >
      {children}
    </Component>
  );
};
