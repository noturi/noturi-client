import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$xl',
  fontFamily: '$body',
  fontSize: '$md',
  fontWeight: '$medium',
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
        paddingHorizontal: '$md',
        fontSize: '$sm',
      },
      md: {
        height: 36,
        paddingHorizontal: '$lg',
        fontSize: '$md',
      },
      lg: {
        height: 44,
        paddingHorizontal: '$xl',
        fontSize: '$lg',
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
