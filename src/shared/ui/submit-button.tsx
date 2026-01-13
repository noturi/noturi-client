import { useKeyboard } from '~/shared/lib';

import { ActivityIndicator, Pressable, View } from 'react-native';

import { Typography } from './typography';

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
      className={`items-center justify-center rounded-xl bg-text-primary px-6 py-4 ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      style={flex !== undefined ? { flex } : undefined}
      onPress={onPress}
    >
      {isLoading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="white" size="small" />
          <Typography className="text-bg-primary" variant="body">
            {loadingText}
          </Typography>
        </View>
      ) : (
        <Typography className="text-bg-primary font-sans-semibold" variant="body">
          {children}
        </Typography>
      )}
    </Pressable>
  );

  if (position === 'fixed') {
    return (
      <View
        className="absolute left-0 right-0 items-end bg-transparent px-6 pt-3"
        style={{
          bottom: followKeyboard ? keyboardHeight : 0,
          paddingBottom: followKeyboard && keyboardHeight > 0 ? 12 : 24,
          zIndex: 50,
        }}
      >
        {buttonContent}
      </View>
    );
  }

  return buttonContent;
};
