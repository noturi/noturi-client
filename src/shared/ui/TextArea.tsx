import { TextArea as TamaguiTextArea, styled } from 'tamagui';

export const TextArea = styled(TamaguiTextArea, {
  // 기본 스타일
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$xl',
  borderWidth: 0,
  color: '$textPrimary',
  fontFamily: '$body',
  fontSize: '$md',
  padding: '$xl',
  placeholderTextColor: '$textMuted',

  // 포커스 스타일
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
        minHeight: 80,
        paddingHorizontal: '$lg',
        fontSize: '$sm',
      },
      md: {
        minHeight: 120,
        paddingHorizontal: '$xl',
        paddingVertical: '$sm',
        fontSize: '$sm',
      },
      lg: {
        minHeight: 160,
        paddingHorizontal: '$2xl',
        fontSize: '$lg',
      },
    },

    variant: {
      default: {
        backgroundColor: '$backgroundSecondary',
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: '$backgroundPrimary',
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
