import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Plus } from 'lucide-react-native';

import { Typography } from './typography';

interface FloatingButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function FloatingButton({
  onPress,
  disabled = false,
  isLoading = false,
  children,
}: FloatingButtonProps) {
  const isDisabled = disabled || isLoading;

  const content = isLoading ? (
    <View className="flex-row items-center gap-2">
      <ActivityIndicator color="white" size="small" />
      {children && (
        <Typography className="text-white" variant="body">
          {children}
        </Typography>
      )}
    </View>
  ) : children ? (
    children
  ) : (
    <Plus color="white" size={24} />
  );

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        children ? styles.withText : styles.iconOnly,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#1d1d1d',
    borderRadius: 22,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
