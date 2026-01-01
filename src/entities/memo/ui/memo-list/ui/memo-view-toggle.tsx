import { Calendar, Star } from '~/shared/lib/icons';
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
}

function ToggleButton({ isActive, onPress, icon, label }: ToggleButtonProps) {
  return (
    <Pressable className="items-center justify-center active:opacity-70" onPress={onPress}>
      <View
        className={`items-center justify-center bg-bg-secondary rounded-5 p-3 h-12 w-12 border ${
          isActive ? 'border-selection' : 'border-border'
        }`}
      >
        {icon}
      </View>
      <Typography
        className={isActive ? 'font-semibold text-selection' : 'text-text-muted'}
        variant="caption2"
      >
        {label}
      </Typography>
    </Pressable>
  );
}

export function MemoViewToggle({ selectedView, onViewChange }: MemoViewToggleProps) {
  return (
    <View className="flex-row gap-4 px-4 py-2">
      <ToggleButton
        icon={<Star className="text-text-secondary fill-text-secondary" size={16} />}
        isActive={selectedView === 'rating'}
        label="메모"
        onPress={() => onViewChange('rating')}
      />
      <ToggleButton
        icon={<Calendar className="text-text-secondary" size={16} />}
        isActive={selectedView === 'calendar'}
        label="캘린더"
        onPress={() => onViewChange('calendar')}
      />
    </View>
  );
}
