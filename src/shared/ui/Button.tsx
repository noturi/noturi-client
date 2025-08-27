import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$sm',
  fontSize: '$2',
  fontWeight: '$3',
  height: 36,

  variants: {
    size: {
      sm: {
        height: 28,
        paddingHorizontal: '$lg',
        fontSize: '$1',
      },
      md: {
        height: 36,
        paddingHorizontal: '$xl',
        fontSize: '$2',
      },
      lg: {
        height: 44,
        paddingHorizontal: '$2xl',
        fontSize: '$3',
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
  },
});
