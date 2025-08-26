import { XStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { List, Star } from '@tamagui/lucide-icons';

export type MemoViewType = 'rating' | 'simple';

interface MemoViewToggleProps {
  selectedView: MemoViewType;
  onViewChange: (view: MemoViewType) => void;
}

interface ToggleButtonProps {
  isActive: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

function ToggleButton({ isActive, onPress, icon, label }: ToggleButtonProps) {
  return (
    <XStack
      alignItems="center"
      backgroundColor={isActive ? '$accent' : '$backgroundTransparent'}
      borderColor={isActive ? '$accent' : '$border'}
      borderRadius="$3"
      borderWidth={1}
      gap="$1"
      paddingHorizontal="$3"
      paddingVertical="$2"
      pointerEvents="box-only"
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      {icon}
      <Typography
        color={isActive ? '$textOnAccent' : '$textMuted'}
        fontWeight={isActive ? '600' : '400'}
        pointerEvents="none"
        size="$2"
      >
        {label}
      </Typography>
    </XStack>
  );
}

export function MemoViewToggle({ selectedView, onViewChange }: MemoViewToggleProps) {
  return (
    <XStack gap="$2" paddingHorizontal="$4" paddingVertical="$2">
      <ToggleButton
        icon={<Star color={selectedView === 'rating' ? '$textOnAccent' : '$textMuted'} size="$1" />}
        isActive={selectedView === 'rating'}
        label="별점메모"
        onPress={() => onViewChange('rating')}
      />
      <ToggleButton
        icon={<List color={selectedView === 'simple' ? '$textOnAccent' : '$textMuted'} size="$1" />}
        isActive={selectedView === 'simple'}
        label="간단메모"
        onPress={() => onViewChange('simple')}
      />
    </XStack>
  );
}
