import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$5',
  fontSize: 14,
  fontWeight: '$4',
  height: 36,

  animation: 'quick',

  pressStyle: {
    scale: 0.95,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        borderColor: '$border',
        borderWidth: 1,
        color: '$textOnPrimary',
        pressStyle: {
          scale: 0.95,
          backgroundColor: '$primaryHover',
        },
      },
      ghost: {
        backgroundColor: '$backgroundTransparent',
        borderColor: '$border',
        borderWidth: 1,
        color: '$textPrimary',
        pressStyle: {
          scale: 0.95,
          backgroundColor: '$surfaceHover',
        },
      },
      link: {
        backgroundColor: '$backgroundTransparent',
        borderColor: '$backgroundTransparent',
        paddingHorizontal: 0,
        paddingVertical: 2,
        textDecorationLine: 'none',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        pressStyle: {
          opacity: 0.7,
        },
      },
    },

    size: {
      sm: {
        height: 28,
        paddingHorizontal: '$3',
        fontSize: 12,
      },
      md: {
        height: 36,
        paddingHorizontal: '$4',
        fontSize: 14,
      },
      lg: {
        height: 44,
        paddingHorizontal: '$5',
        fontSize: 16,
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
    size: 'md',
    variant: 'primary',
  } as const,
});
