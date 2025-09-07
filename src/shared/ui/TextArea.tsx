import { TextArea as TamaguiTextArea, styled } from 'tamagui';

export const TextArea = styled(TamaguiTextArea, {
  // 기본 스타일
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$5',
  borderWidth: 0,
  color: '$textPrimary',
  fontSize: 14,
  padding: '$5',
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
        paddingHorizontal: '$4',
        fontSize: '$2',
      },
      md: {
        minHeight: 120,
        paddingHorizontal: '$5',
        paddingVertical: '$2',
        fontSize: '$2',
      },
      lg: {
        minHeight: 160,
        paddingHorizontal: '$6',
        fontSize: '$4',
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
