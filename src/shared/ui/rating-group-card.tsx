import { Separator, XStack, YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';

import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

import { Card } from './card';
import { RatingStars } from './rating-stars';
import { Typography } from './typography';

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
    <Card padding="$4">
      <XStack
        alignItems="center"
        gap="$2"
        padding="$3"
        pressStyle={{ opacity: 0.7 }}
        onPress={onToggle}
      >
        <XStack alignItems="center" flex={1} gap="$2">
          <RatingStars rating={group.rating} />
          <Typography color="$textMuted" variant="caption1">
            ({group.memos.length}개)
          </Typography>
        </XStack>
        {isExpanded ? (
          <ChevronUp color="$textMuted" size="$3" />
        ) : (
          <ChevronDown color="$textMuted" size="$3" />
        )}
      </XStack>

      {isExpanded && (
        <>
          <Separator borderColor="$border" />
          <YStack gap="$0" padding="$3">
            {group.memos.map((memo) => (
              <XStack
                key={memo.id}
                alignSelf="flex-start"
                paddingVertical="$1"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => onMemoPress?.(memo)}
              >
                <Typography color="$textPrimary" variant="callout">
                  {memo.title}
                </Typography>
              </XStack>
            ))}
          </YStack>
        </>
      )}
    </Card>
  );
}
