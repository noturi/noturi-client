import { Button } from 'tamagui';

import { StyleSheet } from 'react-native';

import { Plus } from '@tamagui/lucide-icons';

interface CalendarFloatingButtonProps {
  onPress: () => void;
}

export function CalendarFloatingButton({ onPress }: CalendarFloatingButtonProps) {
  return (
    <Button
      backgroundColor="$primary"
      borderRadius={22}
      bottom="$4"
      height={44}
      position="absolute"
      pressStyle={{
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
      }}
      right="$4"
      style={styles.shadow}
      width={44}
      onPress={onPress}
    >
      <Plus color="white" size="$1.5" />
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
