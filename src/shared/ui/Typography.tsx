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
    fontSize: '$3xl', // 24px
    fontWeight: '$semibold', // 600
    lineHeight: '$3xl', // 28px
    color: '$textPrimary',
  },
  heading: {
    fontSize: '$3xl', // 24px
    fontWeight: '$medium', // 500
    lineHeight: '$3xl', // 28px
    color: '$textPrimary',
  },
  subheading: {
    fontSize: '$2xl', // 20px
    fontWeight: '$medium', // 500
    lineHeight: '$2xl', // 24px
    color: '$textPrimary',
  },
  title: {
    fontSize: '$xl', // 18px
    fontWeight: '$medium', // 500
    lineHeight: '$xl', // 20px
    color: '$textPrimary',
  },
  subtitle: {
    fontSize: '$lg', // 16px
    fontWeight: '$medium',
    lineHeight: '$lg', // 18px
    color: '$textPrimary',
  },

  body1: {
    fontSize: '$xl', // 18px
    fontWeight: '$light', // 300
    lineHeight: '$xl', // 20px
    color: '$textPrimary',
  },
  body2: {
    fontSize: '$lg', // 16px
    fontWeight: '$light', // 300
    lineHeight: '$lg', // 18px
    color: '$textPrimary',
  },
  body3: {
    fontSize: '$md', // 14px
    fontWeight: '$light', // 300
    lineHeight: '$md', // 16px
    color: '$textPrimary',
  },

  // 작은 텍스트들
  caption1: {
    fontSize: '$md', // 14px
    fontWeight: '$light', // 300
    lineHeight: '$md', // 16px
    color: '$textSecondary',
  },
  caption2: {
    fontSize: '$sm', // 12px
    fontWeight: '$light', // 300
    lineHeight: '$sm', // 14px
    color: '$textMuted',
  },

  // 특수 용도
  link: {
    fontSize: '$md', // 14px
    fontWeight: '$light', // 300
    lineHeight: '$md', // 16px
    color: '$accent',
    textDecorationLine: 'none',
  },
  label: {
    fontSize: '$sm', // 12px
    fontWeight: '$regular', // 400
    lineHeight: '$sm', // 14px
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
      fontFamily="$body"
      margin={variant === 'body1' || variant === 'body2' || variant === 'body3' ? 0 : undefined}
      pointerEvents="none"
      pressStyle={variant === 'link' ? { opacity: 0.7 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};
