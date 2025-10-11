import { FloatingButton } from '~/shared/ui';

interface CalendarFloatingButtonProps {
  onPress: () => void;
}

export function CalendarFloatingButton({ onPress }: CalendarFloatingButtonProps) {
  return <FloatingButton onPress={onPress} />;
}
