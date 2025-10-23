import { Button, Spinner, Text, XStack } from 'tamagui';

import { StyleSheet } from 'react-native';

import { Plus } from '@tamagui/lucide-icons';

interface FloatingButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function FloatingButton({ onPress, disabled = false, isLoading = false, children }: FloatingButtonProps) {
  const content = isLoading ? (
    <XStack alignItems="center" gap="$2">
      <Spinner color="white" size="small" />
      {children && <Text color="white">{children}</Text>}
    </XStack>
  ) : children ? (
    children
  ) : (
    <Plus color="white" size="$1.5" />
  );

  return (
    <Button
      backgroundColor="$primary"
      borderRadius={children ? 22 : 22}
      disabled={disabled || isLoading}
      height={44}
      minWidth={44}
      opacity={disabled || isLoading ? 0.6 : 1}
      paddingHorizontal={children ? "$3" : 0}
      position="absolute"
      pressStyle={{
        opacity: 0.8,
        transform: [{ scale: 1.05 }],
      }}
      right="$4"
      style={styles.shadow}
      width={children ? "auto" : 44}
      onPress={onPress}
    >
      {content}
    </Button>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
