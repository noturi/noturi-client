import { Calendar, Star } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

export type MemoViewType = 'rating' | 'calendar';

interface MemoViewToggleProps {
  selectedView: MemoViewType;
  onViewChange: (view: MemoViewType) => void;
}

interface ToggleButtonProps {
  isActive: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  borderColor: string;
  textMuted: string;
}

function ToggleButton({
  isActive,
  onPress,
  icon,
  label,
  accentColor,
  borderColor,
  textMuted,
}: ToggleButtonProps) {
  return (
    <Pressable className="items-center justify-center active:opacity-70" onPress={onPress}>
      <View
        className="items-center justify-center bg-bg-secondary rounded-5 p-3 h-12 w-12 border"
        style={{ borderColor: isActive ? accentColor : borderColor }}
      >
        {icon}
      </View>
      <Typography
        className={isActive ? 'font-semibold' : ''}
        style={{ color: isActive ? accentColor : textMuted }}
        variant="caption2"
      >
        {label}
      </Typography>
    </Pressable>
  );
}

export function MemoViewToggle({ selectedView, onViewChange }: MemoViewToggleProps) {
  const { hexColors } = useUserTheme();

  return (
    <View className="flex-row gap-4 px-4 py-2">
      <ToggleButton
        accentColor={hexColors.selection}
        borderColor={hexColors.border}
        icon={<Star color={hexColors.textSecondary} fill={hexColors.textSecondary} size={16} />}
        isActive={selectedView === 'rating'}
        label="메모"
        textMuted={hexColors.textMuted}
        onPress={() => onViewChange('rating')}
      />
      <ToggleButton
        accentColor={hexColors.selection}
        borderColor={hexColors.border}
        icon={<Calendar color={hexColors.textSecondary} size={16} />}
        isActive={selectedView === 'calendar'}
        label="캘린더"
        textMuted={hexColors.textMuted}
        onPress={() => onViewChange('calendar')}
      />
    </View>
  );
}
