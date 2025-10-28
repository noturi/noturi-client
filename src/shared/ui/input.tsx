import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  backgroundColor: '$surface',
  borderRadius: '$5',
  borderWidth: 1,
  borderColor: '$border',
  color: '$textPrimary',
  fontSize: 14,
  fontWeight: '$4',

  height: 36,

  placeholderTextColor: '$textMuted',
  textAlignVertical: 'center',

  // 한글 입력 문제 해결을 위한 설정
  autoCorrect: false,
  autoCapitalize: 'none',

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
        paddingHorizontal: '$3',
        fontSize: '$2',
      },
      md: {
        height: 36,
        paddingHorizontal: '$4',
        fontSize: '$3',
      },
      lg: {
        height: 44,
        paddingHorizontal: '$5',
        fontSize: '$4',
      },
    },

    variant: {
      default: {
        backgroundColor: '$backgroundPrimary',
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: '$backgroundTransparent',
        borderWidth: 1,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    hasError: false,
  },
});
