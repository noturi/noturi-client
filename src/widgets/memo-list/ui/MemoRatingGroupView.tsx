import { Separator, XStack, YStack, useTheme } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import { Card, Loading, Typography } from '~/shared/ui';

import { useCallback, useEffect, useState } from 'react';

import { ChevronDown, ChevronUp, Star } from '@tamagui/lucide-icons';

type MemoRatingGroupViewProps = {
  memos: UIMemo[];
  isPending: boolean;
  isError: boolean;
  onMemoPress?: (memo: UIMemo) => void;
};

type RatingGroup = {
  rating: number;
  memos: UIMemo[];
};

const groupMemosByRating = (memos: UIMemo[]): RatingGroup[] => {
  return [5, 4, 3, 2, 1]
    .map((rating) => ({
      rating,
      memos: memos.filter((memo) => Math.ceil(memo.rating) === rating),
    }))
    .filter((group) => group.memos.length > 0);
};

function RatingStars({ rating }: { rating: number }) {
  const theme = useTheme();

  return (
    <XStack alignItems="center" gap="$xs" pointerEvents="none">
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} color="$star" fill={theme.star.val} size="$md" />
      ))}
    </XStack>
  );
}

type RatingGroupCardProps = {
  group: RatingGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onMemoPress?: (memo: UIMemo) => void;
};

function RatingGroupCard({ group, isExpanded, onToggle, onMemoPress }: RatingGroupCardProps) {
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

export function MemoRatingGroupView({
  memos,
  isPending,
  isError,
  onMemoPress,
}: MemoRatingGroupViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const ratingGroups = groupMemosByRating(memos);

  useEffect(() => {
    const groups = groupMemosByRating(memos);
    const newExpandedGroups = groups.reduce(
      (acc, group) => ({
        ...acc,
        [group.rating]: true,
      }),
      {} as Record<number, boolean>,
    );

    setExpandedGroups(newExpandedGroups);
  }, [memos]);

  const handleToggle = useCallback((rating: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  }, []);

  if (isPending) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Loading />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Typography color="$textMuted">메모를 불러오는데 실패했습니다</Typography>
      </YStack>
    );
  }

  if (memos.length === 0) {
    return (
      <YStack alignItems="center" flex={1} justifyContent="center">
        <Typography color="$textMuted">작성된 메모가 없습니다</Typography>
      </YStack>
    );
  }

  return (
    <YStack gap="$md">
      <Typography color="$textPrimary" paddingLeft="$md" variant="subheading">
        메모
      </Typography>
      <YStack gap="$lg">
        {ratingGroups.map((group) => (
          <RatingGroupCard
            key={group.rating}
            group={group}
            isExpanded={expandedGroups[group.rating] || false}
            onMemoPress={onMemoPress}
            onToggle={() => handleToggle(group.rating)}
          />
        ))}
      </YStack>
    </YStack>
  );
}
