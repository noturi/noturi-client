import { Plus } from '~/shared/lib/icons';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Typography } from './typography';

interface FloatingButtonProps extends PressableProps {
  onPress: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 5,
};

export function FloatingButton({
  onPress,
  disabled = false,
  isLoading = false,
  children,
  style,
  className,
  ...props
}: FloatingButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      className={`h-[44px] items-center justify-center rounded-full bg-primary ${children ? 'min-w-[44px] px-3' : 'w-[44px]'} ${isDisabled ? 'opacity-60' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      style={({ pressed }) => [
        shadowStyle,
        pressed && !isDisabled && { opacity: 0.8, transform: [{ scale: 1.05 }] },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {isLoading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="white" size="small" />
          {children && (
            <Typography className="text-primary-text" variant="body">
              {children}
            </Typography>
          )}
        </View>
      ) : children ? (
        <Typography className="text-primary-text" variant="body">
          {children}
        </Typography>
      ) : (
        <Plus className="text-primary-text" size={24} />
      )}
    </Pressable>
  );
}
