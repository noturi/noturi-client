import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$xl',
  borderWidth: 0,
  color: '$textPrimary',
  fontSize: 13,

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
        borderColor: 'red',
        focusStyle: {
          borderColor: 'red',
        },
      },
    },

    size: {
      sm: {
        height: 32,
        paddingHorizontal: '$lg',
        fontSize: '$2',
      },
      md: {
        height: 42,
        paddingHorizontal: '$xl',
        fontSize: 13,
      },
      lg: {
        height: 48,
        paddingHorizontal: '$2xl',
        fontSize: 13,
      },
    },

    variant: {
      default: {
        backgroundColor: '$backgroundSecondary',
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    variant: 'default',
    hasError: false,
  },
});
