import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$5',
  fontSize: 17,
  height: 44,
  minWidth: 44,

  animation: 'bouncy',

  pressStyle: {
    scale: 0.96,
    opacity: 0.8,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$blue10',
          opacity: 0.9,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: '$gray8',
        borderWidth: 1,
        color: '$blue9',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$gray3',
        },
      },
      destructive: {
        backgroundColor: '$red9',
        color: 'white',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$red10',
          opacity: 0.9,
        },
      },
      plain: {
        backgroundColor: 'transparent',
        color: '$blue9',
        paddingHorizontal: '$2',
        pressStyle: {
          opacity: 0.6,
          scale: 1,
        },
      },
      filled: {
        backgroundColor: '$gray6',
        color: '$textPrimary',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$gray7',
        },
      },
      tinted: {
        backgroundColor: '$blue4',
        color: '$blue9',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$blue5',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: '$gray8',
        borderWidth: 1,
        color: '$textPrimary',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$gray3',
        },
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: '$borderColor',
        borderWidth: 1,
        color: '$textPrimary',
        pressStyle: {
          scale: 0.96,
          backgroundColor: '$backgroundSecondary',
        },
      },
    },

    size: {
      sm: {
        height: 32,
        paddingHorizontal: '$3',
        fontSize: 13,
        fontWeight: '400',
      },
      md: {
        height: 44,
        paddingHorizontal: '$4',
        fontSize: 17,
        fontWeight: '400',
      },
      lg: {
        height: 56,
        paddingHorizontal: '$5',
        fontSize: 17,
        fontWeight: '600',
      },
    },

    fullWidth: {
      true: {
        flex: 1,
        alignSelf: 'stretch',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
  } as const,
});
