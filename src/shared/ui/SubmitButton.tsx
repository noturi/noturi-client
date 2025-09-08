import { View } from 'tamagui';
import { Button } from '~/shared/ui';

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
      <View
        backgroundColor="$backgroundPrimary"
        bottom={0}
        left={0}
        paddingBottom={keyboardHeight > 0 ? keyboardHeight + 20 : 40}
        paddingHorizontal={10}
        paddingTop={10}
        position="absolute"
        right={0}
        zIndex="$5"
      >
        <Button disabled={disabled} size="lg" onPress={onPress}>
          {isLoading ? loadingText : children}
        </Button>
      </View>
    );
  }

  return (
    <Button
      bottom={keyboardHeight > 0 ? keyboardHeight + 20 : 40}
      disabled={disabled}
      size="lg"
      onPress={onPress}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};
