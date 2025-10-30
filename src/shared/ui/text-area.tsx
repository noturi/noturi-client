import { TextArea as TamaguiTextArea, styled } from 'tamagui';

export const TextArea = styled(TamaguiTextArea, {
  // 기본 스타일
  backgroundColor: '$backgroundPrimary',
  borderRadius: '$5',
  borderWidth: 1,
  borderColor: '$border',
  color: '$textPrimary',
  fontSize: 14,

  paddingHorizontal: '$2',
  paddingVertical: '$3',
  placeholderTextColor: '$textMuted',

  // 한글 입력 문제 해결을 위한 설정
  autoCorrect: false,
  autoCapitalize: 'none',
  keyboardType: 'default',

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
        fontSize: '$2',
      },
      md: {
        minHeight: 120,
        fontSize: '$3',
      },
      lg: {
        minHeight: 160,
        fontSize: '$4',
      },
    },

    variant: {
      default: {
        backgroundColor: '$backgroundPrimary',
        borderWidth: 1,
      },
      outlined: {
        backgroundColor: '$backgroundPrimary',
        borderWidth: 0,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    hasError: false,
  },
});
