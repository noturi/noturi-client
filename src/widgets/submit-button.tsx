import { Spinner, Text, View, XStack } from 'tamagui';
import { useKeyboard } from '~/shared/lib';
import { Button } from '~/shared/ui';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  loadingText?: string;
  position?: 'fixed' | 'static';
  followKeyboard?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'plain'
    | 'filled'
    | 'tinted'
    | 'ghost'
    | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  flex?: number;
}

export const SubmitButton = ({
  children,
  isLoading = false,
  disabled = false,
  onPress,
  loadingText = '처리중...',
  position = 'fixed',
  followKeyboard = true,
  variant = 'primary',
  ...props
}: SubmitButtonProps) => {
  const { keyboardHeight } = useKeyboard();

  const loadingContent = (
    <XStack alignItems="center" gap="$2">
      <Spinner color="white" size="small" />
      <Text color="white">{loadingText}</Text>
    </XStack>
  );

  if (position === 'fixed') {
    return (
      <View
        alignItems="flex-end"
        backgroundColor="transparent"
        bottom={followKeyboard ? keyboardHeight : 0}
        left={0}
        paddingBottom={followKeyboard && keyboardHeight > 0 ? 12 : 24}
        paddingHorizontal={24}
        paddingTop={12}
        position="absolute"
        right={0}
        zIndex="$5"
      >
        <Button
          disabled={disabled || isLoading}
          opacity={isLoading ? 0.8 : 1}
          variant={variant}
          onPress={onPress}
          {...props}
        >
          {isLoading ? loadingContent : children}
        </Button>
      </View>
    );
  }

  return (
    <Button
      disabled={disabled || isLoading}
      opacity={isLoading ? 0.8 : 1}
      size="lg"
      variant={variant}
      onPress={onPress}
      {...props}
    >
      {isLoading ? loadingContent : children}
    </Button>
  );
};
