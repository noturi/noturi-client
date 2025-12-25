import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import type { UIMemo } from '~/entities/memo/model/types';
import { type RatingGroup, RatingGroupCard } from '~/entities/memo/ui';
import { Typography } from '~/shared/ui';

type MemoRatingGroupViewProps = {
  memos: UIMemo[];
  header?: ReactNode;
  onMemoPress?: (memo: UIMemo) => void;
};

const groupMemosByRating = (memos: UIMemo[]): RatingGroup[] => {
  const groups = [5, 4, 3, 2, 1, 0]
    .map((rating) => ({
      rating,
      memos: memos.filter((memo) => {
        if (rating === 0) {
          return !memo.rating || memo.rating === 0;
        }
        return Math.floor(memo.rating) === rating;
      }),
    }))
    .filter((group) => group.memos.length > 0);

  return groups;
};

export function MemoRatingGroupView({ memos, header, onMemoPress }: MemoRatingGroupViewProps) {
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

  if (memos.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Typography className="text-text-muted" variant="callout">
          작성된 메모가 없습니다
        </Typography>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {header}
      <View className="gap-4 mb-5">
        {ratingGroups.map((group) => (
          <RatingGroupCard
            key={group.rating}
            group={group}
            isExpanded={expandedGroups[group.rating] || false}
            onMemoPress={onMemoPress}
            onToggle={() => handleToggle(group.rating)}
          />
        ))}
      </View>
    </View>
  );
}
