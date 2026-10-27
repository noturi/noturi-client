import { Typography } from '~/shared/ui';

import { type ReactNode, useState } from 'react';
import { View } from 'react-native';

import type { RatingGroupData, UIMemo } from '../../../model/types';
import { RatingGroupCard, RatingGroupCardSkeleton } from '../../rating-group-card';

type MemoRatingGroupViewProps = {
  ratingGroups: RatingGroupData[];
  header?: ReactNode;
  /** 펼쳐진 그룹의 목록 끝 센티넬 View (다음 페이지가 있을 때만 존재, 사라지면 null) */
  endSentinelRef?: (rating: number, node: View | null) => void;
  /** 센티넬의 레이아웃이 바뀔 때 (마운트, 메모 추가로 위치 이동) */
  onEndSentinelLayout?: (rating: number) => void;
  onMemoPress?: (memo: UIMemo) => void;
};

export function MemoRatingGroupView({
  ratingGroups,
  header,
  endSentinelRef,
  onEndSentinelLayout,
  onMemoPress,
}: MemoRatingGroupViewProps) {
  // 그룹은 기본 펼침 — 사용자가 접은 그룹만 기록한다 (새 그룹이 도착해도 effect 없이 펼침)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  const handleToggle = (rating: number) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  };

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
              endSentinelRef={(node) => endSentinelRef?.(group.rating, node)}
              group={group}
              isExpanded={!collapsedGroups[group.rating]}
              onEndSentinelLayout={() => onEndSentinelLayout?.(group.rating)}
              onMemoPress={onMemoPress}
              onToggle={() => handleToggle(group.rating)}
            />
          ) : null,
        )}
      </View>
    </View>
  );
}
