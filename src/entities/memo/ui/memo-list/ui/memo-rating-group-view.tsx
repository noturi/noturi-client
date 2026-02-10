import type { UIMemo } from '~/entities/memo/model/types';
import type { RatingGroup } from '~/entities/memo/ui/rating-group-card';
import { RatingGroupCard } from '~/entities/memo/ui/rating-group-card';
import { Typography } from '~/shared/ui';

import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

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
  const ratingGroups = groupMemosByRating(memos);

  const initialExpanded = useMemo(
    () =>
      ratingGroups.reduce(
        (acc, group) => ({ ...acc, [group.rating]: true }),
        {} as Record<number, boolean>,
      ),
    [memos],
  );

  const [expandedGroups, setExpandedGroups] = useState(initialExpanded);
  const [prevMemos, setPrevMemos] = useState(memos);

  // 메모가 바뀌면 모두 열림으로 리셋
  if (prevMemos !== memos) {
    setPrevMemos(memos);
    setExpandedGroups(initialExpanded);
  }

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
