import { YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import { Loading, type RatingGroup, RatingGroupCard, Typography } from '~/shared/ui';

import { useCallback, useEffect, useState } from 'react';

type MemoRatingGroupViewProps = {
  memos: UIMemo[];
  isPending: boolean;
  isError: boolean;
  onMemoPress?: (memo: UIMemo) => void;
};

const groupMemosByRating = (memos: UIMemo[]): RatingGroup[] => {
  return [5, 4, 3, 2, 1]
    .map((rating) => ({
      rating,
      memos: memos.filter((memo) => Math.ceil(memo.rating) === rating),
    }))
    .filter((group) => group.memos.length > 0);
};

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
        <Typography color="$textMuted" variant="body2">
          작성된 메모가 없습니다
        </Typography>
      </YStack>
    );
  }

  return (
    <YStack gap="$3">
      <Typography paddingLeft="$3" variant="subheading">
        메모
      </Typography>
      <YStack gap="$4" marginBottom="$5">
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
