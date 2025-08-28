import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$xl',
  borderWidth: 0,
  color: '$textPrimary',
  fontFamily: '$body',
  fontSize: '$md',
  fontWeight: '$medium',
  height: 36,

  placeholderTextColor: '$textMuted',
  textAlignVertical: 'center',

  focusStyle: {
    borderWidth: 1,
    borderColor: '$primary',
  },

  variants: {
    hasError: {
      true: {
        borderWidth: 1,
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
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

    variant: {
      default: {
        backgroundColor: '$backgroundSecondary',
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: '$backgroundTransparent',
        borderWidth: 1,
        borderColor: '$border',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    variant: 'default',
    hasError: false,
  },
});
