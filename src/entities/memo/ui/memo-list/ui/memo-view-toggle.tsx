import { Calendar, Star } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
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
  const { currentTheme } = useUserTheme();
  const accentColor = rgbToHex(currentTheme.colors.accent);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);

  return (
    <View className="flex-row gap-4 px-4 py-2">
      <ToggleButton
        accentColor={accentColor}
        borderColor={borderColor}
        icon={<Star color="#ebd759" fill="#ebd759" size={16} />}
        isActive={selectedView === 'rating'}
        label="메모"
        textMuted={textMuted}
        onPress={() => onViewChange('rating')}
      />
      <ToggleButton
        accentColor={accentColor}
        borderColor={borderColor}
        icon={<Calendar color="#3b82f6" size={16} />}
        isActive={selectedView === 'calendar'}
        label="캘린더"
        textMuted={textMuted}
        onPress={() => onViewChange('calendar')}
      />
    </View>
  );
}
