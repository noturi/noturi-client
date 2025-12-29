import { Plus } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Typography } from './typography';

interface FloatingButtonProps extends PressableProps {
  onPress: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function FloatingButton({
  onPress,
  disabled = false,
  isLoading = false,
  children,
  style,
  className,
  ...props
}: FloatingButtonProps) {
  const { hexColors } = useUserTheme();
  const isDisabled = disabled || isLoading;

  const content = isLoading ? (
    <View className="flex-row items-center gap-2">
      <ActivityIndicator color={hexColors.primaryText} size="small" />
      {children && (
        <Typography style={{ color: hexColors.primaryText }} variant="body">
          {children}
        </Typography>
      )}
    </View>
  ) : children ? (
    <Typography style={{ color: hexColors.primaryText }} variant="body">
      {children}
    </Typography>
  ) : (
    <Plus color={hexColors.primaryText} size={24} />
  );

  return (
    <Pressable
      className={`bg-primary rounded-full ${className ?? ''}`}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { shadowColor: '#000' },
        children ? styles.withText : styles.iconOnly,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 22,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconOnly: {
    width: 44,
  },
  withText: {
    minWidth: 44,
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
});
