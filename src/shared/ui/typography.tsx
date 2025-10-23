import { H1, H2, H3, H4, H5, Paragraph, SizableText } from 'tamagui';

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

const getComponentByVariant = (variant: TypographyVariant) => {
  switch (variant) {
    case 'largeTitle':
      return H1;
    case 'title1':
      return H2;
    case 'title2':
      return H3;
    case 'title3':
      return H4;
    case 'headline':
      return H5;
    case 'body':
    case 'callout':
    case 'subheadline':
      return Paragraph;
    case 'footnote':
    case 'caption1':
    case 'caption2':
    case 'link':
    case 'label':
    case 'number':
    default:
      return SizableText;
  }
};

const variantStyles = {
  // iOS Typography Scale - https://developer.apple.com/design/human-interface-guidelines/typography
  largeTitle: {
    fontSize: 34, // 34pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 41, // 41pt
    color: '$textPrimary',
    letterSpacing: 0.37,
  },
  title1: {
    fontSize: 28, // 28pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 34, // 34pt
    color: '$textPrimary',
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22, // 22pt
    fontWeight: '$5', // 600 - semibold
    lineHeight: 28, // 28pt
    color: '$textPrimary',
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20, // 20pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 25, // 25pt
    color: '$textPrimary',
    letterSpacing: 0.38,
  },
  headline: {
    fontSize: 17, // 17pt
    fontWeight: '$5', // 600 - semibold
    lineHeight: 22, // 22pt
    color: '$textPrimary',
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17, // 17pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 22, // 22pt
    color: '$textPrimary',
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16, // 16pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 21, // 21pt
    color: '$textPrimary',
    letterSpacing: -0.32,
  },
  subheadline: {
    fontSize: 15, // 15pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 20, // 20pt
    color: '$textPrimary',
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13, // 13pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 18, // 18pt
    color: '$textPrimary',
    letterSpacing: -0.08,
  },
  caption1: {
    fontSize: 12, // 12pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 16, // 16pt
    color: '$textSecondary',
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11, // 11pt
    fontWeight: '$3', // 400 - regular
    lineHeight: 13, // 13pt
    color: '$textMuted',
    letterSpacing: 0.07,
  },

  // 특수 용도
  link: {
    fontSize: 17, // body와 동일
    fontWeight: '$3', // 400 - regular
    lineHeight: 22,
    color: '$accent',
    textDecorationLine: 'none',
    letterSpacing: -0.41,
  },
  label: {
    fontSize: 11, // 11pt
    fontWeight: '$4', // 500 - medium
    lineHeight: 13,
    color: '$textPrimary',
    textTransform: 'uppercase',
    letterSpacing: 0.07,
  },
  number: {
    fontSize: 15, // 17pt
    fontWeight: '$6', // 700 - bold
    lineHeight: 22, // 22pt
    color: '$textNumber',
    letterSpacing: -0.41,
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
      margin={
        variant === 'body' || variant === 'callout' || variant === 'subheadline' ? 0 : undefined
      }
      pointerEvents="none"
      pressStyle={variant === 'link' ? { opacity: 0.7 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};
