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
    fontSize: '$8', // 28px
    fontWeight: '$5', // 600
    lineHeight: '$8', // 34px
    color: '$textPrimary',
  },
  heading: {
    fontSize: '$7', // 24px
    fontWeight: '$4', // 500
    lineHeight: '$7', // 30px
    color: '$textPrimary',
  },
  subheading: {
    fontSize: '$6', // 20px
    fontWeight: '$4', // 500
    lineHeight: '$6', // 26px
    color: '$textPrimary',
  },
  title: {
    fontSize: '$5', // 18px
    fontWeight: '$4', // 500
    lineHeight: '$5', // 24px
    color: '$textPrimary',
  },
  subtitle: {
    fontSize: '$4', // 16px
    fontWeight: '$4',
    lineHeight: '$4', // 22px
    color: '$textPrimary',
  },

  body1: {
    fontSize: '$5', // 18px
    fontWeight: '$3', // 300
    lineHeight: '$5', // 24px
    color: '$textPrimary',
  },
  body2: {
    fontSize: '$4', // 16px
    fontWeight: '$3', // 300
    lineHeight: '$4', // 22px
    color: '$textPrimary',
  },
  body3: {
    fontSize: '$3', // 14px
    fontWeight: '$3', // 300
    lineHeight: '$3', // 20px
    color: '$textPrimary',
  },

  // 작은 텍스트들
  caption1: {
    fontSize: '$3', // 14px
    fontWeight: '$3', // 300
    lineHeight: '$3', // 20px
    color: '$textSecondary',
  },
  caption2: {
    fontSize: '$2', // 12px
    fontWeight: '$3', // 300
    lineHeight: '$2', // 18px
    color: '$textMuted',
  },

  // 특수 용도
  link: {
    fontSize: '$3', // 14px
    fontWeight: '$3', // 300
    lineHeight: '$3', // 20px
    color: '$accent',
    textDecorationLine: 'none',
  },
  label: {
    fontSize: '$2', // 12px
    fontWeight: '$3', // 400
    lineHeight: '$2', // 18px
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
      {...styles}
      margin={variant === 'body1' || variant === 'body2' || variant === 'body3' ? 0 : undefined}
      pressStyle={variant === 'link' ? { opacity: 0.7 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};
