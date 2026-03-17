import type { RatingGroupData, UIMemo } from '~/entities/memo/model/types';
import { RatingGroupCard, RatingGroupCardSkeleton } from '~/entities/memo/ui/rating-group-card';
import { Typography } from '~/shared/ui';

import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

type MemoRatingGroupViewProps = {
  ratingGroups: RatingGroupData[];
  header?: ReactNode;
  onMemoPress?: (memo: UIMemo) => void;
};

export function MemoRatingGroupView({
  ratingGroups,
  header,
  onMemoPress,
}: MemoRatingGroupViewProps) {
  const visibleGroups = ratingGroups.filter((group) => group.total > 0);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  // 새 그룹이 도착하면 열림 상태로 추가
  const visibleRatingsKey = visibleGroups.map((g) => g.rating).join(',');
  useEffect(() => {
    if (!visibleRatingsKey) return;
    setExpandedGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const group of visibleGroups) {
        if (!(group.rating in next)) {
          next[group.rating] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRatingsKey]);

  const handleToggle = useCallback((rating: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  }, []);

  const isAnyLoading = ratingGroups.some((group) => group.isLoading);
  const totalMemos = ratingGroups.reduce((sum, group) => sum + group.total, 0);

  if (!isAnyLoading && totalMemos === 0) {
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
      <View className="mb-5 gap-4">
        {ratingGroups.map((group) =>
          group.isLoading ? (
            <RatingGroupCardSkeleton key={group.rating} />
          ) : group.total > 0 ? (
            <RatingGroupCard
              key={group.rating}
              group={group}
              isExpanded={expandedGroups[group.rating] || false}
              onMemoPress={onMemoPress}
              onToggle={() => handleToggle(group.rating)}
            />
          ) : null,
        )}
      </View>
    </View>
  );
}
