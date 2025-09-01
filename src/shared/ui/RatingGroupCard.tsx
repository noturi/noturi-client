import { Separator, XStack, YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';

import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

import { Card } from './Card';
import { RatingStars } from './RatingStars';
import { Typography } from './Typography';

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
    <Card padding="$lg">
      <XStack
        alignItems="center"
        gap="$sm"
        padding="$md"
        pressStyle={{ opacity: 0.7 }}
        onPress={onToggle}
      >
        <XStack alignItems="center" flex={1} gap="$sm">
          <RatingStars rating={group.rating} />
          <Typography color="$textMuted" variant="caption1">
            ({group.memos.length}개)
          </Typography>
        </XStack>
        {isExpanded ? (
          <ChevronUp color="$textMuted" size="$md" />
        ) : (
          <ChevronDown color="$textMuted" size="$md" />
        )}
      </XStack>

      {isExpanded && (
        <>
          <Separator borderColor="$border" />
          <YStack gap="$none" padding="$md">
            {group.memos.map((memo) => (
              <XStack
                key={memo.id}
                alignSelf="flex-start"
                paddingVertical="$xs"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => onMemoPress?.(memo)}
              >
                <Typography color="$textPrimary" variant="body2">
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
