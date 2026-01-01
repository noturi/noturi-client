import type { UIMemo } from '~/entities/memo/model/types';
import { ChevronDown, ChevronUp } from '~/shared/lib/icons';
import { Card, RatingStars, Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

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
          <ChevronUp className="text-text-muted" size={16} />
        ) : (
          <ChevronDown className="text-text-muted" size={16} />
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
