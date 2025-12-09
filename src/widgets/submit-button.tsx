import { Spinner, View, XStack } from 'tamagui';
import { useKeyboard } from '~/shared/lib';
import { Typography } from '~/shared/ui';

import { Pressable, StyleSheet } from 'react-native';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  loadingText?: string;
  position?: 'fixed' | 'static';
  followKeyboard?: boolean;
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
  flex,
}: SubmitButtonProps) => {
  const { keyboardHeight } = useKeyboard();

  const isDisabled = disabled || isLoading;

  const buttonContent = (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        flex !== undefined && { flex },
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <XStack alignItems="center" gap="$2">
          <Spinner color="white" size="small" />
          <Typography color="white" variant="body">
            {loadingText}
          </Typography>
        </XStack>
      ) : (
        <Typography color="white" fontWeight="600" variant="body">
          {children}
        </Typography>
      )}
    </Pressable>
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
        {buttonContent}
      </View>
    );
  }

  return buttonContent;
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1d1d1d',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
