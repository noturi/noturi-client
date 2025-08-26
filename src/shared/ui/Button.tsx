import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$2',
  fontSize: '$2',
  fontWeight: '$3',
  height: 36,

  variants: {
    size: {
      sm: {
        height: 28,
        paddingHorizontal: '$2.5',
        fontSize: '$1',
      },
      md: {
        height: 36,
        paddingHorizontal: '$3',
        fontSize: '$2',
      },
      lg: {
        height: 44,
        paddingHorizontal: '$4',
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
