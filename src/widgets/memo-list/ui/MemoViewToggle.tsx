import { XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { Bell, Star } from '@tamagui/lucide-icons';

export type MemoViewType = 'rating' | 'simple' | 'notification';

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
    <YStack
      alignItems="center"
      justifyContent="center"
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      <XStack
        alignItems="center"
        backgroundColor="$backgroundSecondary"
        borderColor={isActive ? '$primary' : '$border'}
        borderRadius="$5"
        borderWidth={1}
        height={48}
        justifyContent="center"
        padding="$3"
        width={48}
      >
        {icon}
      </XStack>
      <Typography
        color={isActive ? '$textPrimary' : '$textMuted'}
        fontWeight={isActive ? 600 : 400}
        pointerEvents="none"
        variant="caption2"
      >
        {label}
      </Typography>
    </YStack>
  );
}

export function MemoViewToggle({ selectedView, onViewChange }: MemoViewToggleProps) {
  return (
    <XStack gap="$4" paddingHorizontal="$4" paddingVertical="$2">
      <ToggleButton
        icon={<Star color="$star" fill="#ebd759" size="$3" />}
        isActive={selectedView === 'rating'}
        label="별점메모"
        onPress={() => onViewChange('rating')}
      />
      <ToggleButton
        icon={<Bell color="$blue10" size="$3" />}
        isActive={selectedView === 'notification'}
        label="알림메모"
        onPress={() => onViewChange('notification')}
      />
      {/* <ToggleButton
        icon={<List color="$secondary" size="$md" />}
        isActive={selectedView === 'simple'}
        label="간단메모"
        onPress={() => onViewChange('simple')}
      /> */}
    </XStack>
  );
}
