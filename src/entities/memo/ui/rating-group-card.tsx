import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { UIMemo } from '~/entities/memo/model/types';
import { useUserTheme } from '~/features/theme';
import { Card, RatingStars, Typography } from '~/shared/ui';

export type RatingGroup = {
  rating: number;
  memos: UIMemo[];
};

interface RatingGroupCardProps {
  group: RatingGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onMemoPress?: (memo: UIMemo) => void;
}

export function RatingGroupCard({
  group,
  isExpanded,
  onToggle,
  onMemoPress,
}: RatingGroupCardProps) {
  const { currentTheme } = useUserTheme();
  const mutedColor = `rgb(${currentTheme.colors.textMuted})`;

  return (
    <Card className="p-4">
      <Pressable className="flex-row items-center gap-2 p-3 active:opacity-70" onPress={onToggle}>
        <View className="flex-row items-center flex-1 gap-2">
          <RatingStars rating={group.rating} />
          <Typography className="text-text-muted" variant="caption1">
            ({group.memos.length}개)
          </Typography>
        </View>
        {isExpanded ? (
          <ChevronUp color={mutedColor} size={16} />
        ) : (
          <ChevronDown color={mutedColor} size={16} />
        )}
      </Pressable>

      {isExpanded && (
        <>
          <View className="h-px bg-border" />
          <View className="p-3">
            {group.memos.map((memo) => (
              <Pressable
                key={memo.id}
                className="self-start py-1 active:opacity-70"
                onPress={() => onMemoPress?.(memo)}
              >
                <Typography className="text-text-primary" variant="callout">
                  {memo.title}
                </Typography>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </Card>
  );
}
