import { Button } from 'tamagui';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  keyboardHeight?: number;
  onPress: () => void;
  loadingText?: string;
  position?: 'fixed' | 'static';
}

export const SubmitButton = ({
  children,
  isLoading = false,
  isDisabled = false,
  keyboardHeight = 0,
  onPress,
  loadingText = '처리중...',
  position = 'fixed',
}: SubmitButtonProps) => {
  const disabled = isDisabled || isLoading;

  if (position === 'fixed') {
    return (
      <Button
        backgroundColor={disabled ? '$surfaceDisabled' : '$primary'}
        borderRadius="$xl"
        bottom={keyboardHeight > 0 ? keyboardHeight + 40 : 30}
        color={disabled ? '$textMuted' : '$textOnAccent'}
        fontFamily="$body"
        fontSize="$lg"
        fontWeight="$semibold"
        height="$6xl"
        left={20}
        paddingHorizontal="$5xl"
        position="absolute"
        right={20}
        zIndex={1000}
        onPress={onPress}
      >
        {isLoading ? loadingText : children}
      </Button>
    );
  }

  return (
    <Button
      backgroundColor={disabled ? '$surfaceDisabled' : '$primary'}
      color={disabled ? '$textMuted' : '$textOnAccent'}
      fontFamily="$body"
      fontSize="$lg"
      height="$5xl"
      paddingHorizontal="$5xl"
      onPress={onPress}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};
