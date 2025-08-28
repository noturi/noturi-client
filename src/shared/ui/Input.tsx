import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$xl',
  borderWidth: 0,
  color: '$textPrimary',
  fontSize: 14,
  fontWeight: '500',
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
        fontSize: 12,
      },
      md: {
        height: 36,
        paddingHorizontal: '$lg',
        fontSize: 14,
      },
      lg: {
        height: 44,
        paddingHorizontal: '$xl',
        fontSize: 16,
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
