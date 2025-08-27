import { TextArea as TamaguiTextArea, styled } from 'tamagui';

export const TextArea = styled(TamaguiTextArea, {
  // 기본 스타일
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$xl',
  borderWidth: 0,
  color: '$textPrimary',
  fontSize: '$4',
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
        borderColor: 'red',
        focusStyle: {
          borderColor: 'red',
        },
      },
    },

    size: {
      sm: {
        minHeight: 80,
        paddingHorizontal: '$lg',
        fontSize: '$2',
      },
      md: {
        minHeight: 120,
        paddingHorizontal: '$xl',
        paddingVertical: '$sm',
        fontSize: 13,
      },
      lg: {
        minHeight: 160,
        paddingHorizontal: '$2xl',
        fontSize: '$5',
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
