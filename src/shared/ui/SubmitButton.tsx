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
        borderRadius="$5"
        bottom={keyboardHeight > 0 ? keyboardHeight + 40 : 30}
        color={disabled ? '$textMuted' : '$textOnAccent'}
        fontSize="$4"
        fontWeight="$5"
        height="$10"
        left={20}
        paddingHorizontal="$9"
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
      fontSize="$4"
      height="$9"
      paddingHorizontal="$9"
      onPress={onPress}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};
