import { TextArea as TamaguiTextArea, styled } from 'tamagui';

export const TextArea = styled(TamaguiTextArea, {
  // 기본 스타일
  backgroundColor: '$backgroundSecondary',
  borderRadius: '$6',
  borderWidth: 0,
  color: '$textPrimary',
  fontSize: '$4',
  padding: '$3',
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
        paddingHorizontal: '$2.5',
        fontSize: '$2',
      },
      md: {
        minHeight: 120,
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        fontSize: 13,
      },
      lg: {
        minHeight: 160,
        paddingHorizontal: '$4',
        fontSize: '$5',
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
