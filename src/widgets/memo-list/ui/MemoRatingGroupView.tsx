import { Separator, Text, XStack, YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import Logger from '~/shared/lib/logger';
import { Loading, Typography } from '~/shared/ui';

import { useEffect, useState } from 'react';

import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';

type MemoRatingGroupViewProps = {
  memos: UIMemo[];
  isPending: boolean;
  isError: boolean;
  onMemoPress?: (memo: UIMemo) => void;
};

const groupMemosByRating = (memos: UIMemo[]) => {
  const groups = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    memos: memos.filter((memo) => Math.ceil(memo.rating) === rating),
  }));

  return groups;
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <XStack gap="$0.5">
      {Array.from({ length: rating }, (_, i) => (
        <Text key={i} color="gold" fontSize="$3">
          ★
        </Text>
      ))}
    </XStack>
  );
}

export function MemoRatingGroupView({
  memos,
  isPending,
  isError,
  onMemoPress,
}: MemoRatingGroupViewProps) {
  // 각 별점 그룹의 접기/펼치기 상태 관리 (아이템이 있는 경우만 기본 펼침)
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  // memos 데이터가 변경될 때마다 초기 상태 업데이트
  useEffect(() => {
    Logger.debug('MemoRatingGroupView', `memos 변경: ${memos.length}개`, { memos });

    const ratingGroups = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      memos: memos.filter((memo) => Math.ceil(memo.rating) === rating),
    }));

    Logger.debug('MemoRatingGroupView', 'ratingGroups 계산 완료', { ratingGroups });

    const newExpandedGroups = {
      5: (ratingGroups.find((g) => g.rating === 5)?.memos.length || 0) > 0,
      4: (ratingGroups.find((g) => g.rating === 4)?.memos.length || 0) > 0,
      3: (ratingGroups.find((g) => g.rating === 3)?.memos.length || 0) > 0,
      2: (ratingGroups.find((g) => g.rating === 2)?.memos.length || 0) > 0,
      1: (ratingGroups.find((g) => g.rating === 1)?.memos.length || 0) > 0,
    };

    Logger.debug('MemoRatingGroupView', 'expandedGroups 업데이트', { newExpandedGroups });
    setExpandedGroups(newExpandedGroups);
  }, [memos]); // memos가 변경될 때마다 실행

  // 특정 별점 그룹 토글
  const toggleGroup = (rating: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  };
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

  const ratingGroups = groupMemosByRating(memos);

  return (
    <YStack gap="$4">
      {ratingGroups.map((group, index) => (
        <YStack key={group.rating}>
          <YStack gap="$2">
            {/* 별점 헤더 (메모가 있을 때만 클릭 가능) */}
            <XStack
              alignItems="center"
              gap="$2"
              paddingBottom="$1"
              pointerEvents={group.memos.length > 0 ? 'box-only' : 'none'}
              pressStyle={group.memos.length > 0 ? { opacity: 0.7 } : undefined}
              onPress={group.memos.length > 0 ? () => toggleGroup(group.rating) : undefined}
            >
              <XStack>
                <RatingStars rating={group.rating} />
                <Typography color="$textMuted" size="$2">
                  ({group.memos.length}개)
                </Typography>
              </XStack>
              {group.memos.length > 0 &&
                (expandedGroups[group.rating] ? (
                  <ChevronDown color="$textMuted" size="$3" />
                ) : (
                  <ChevronRight color="$textMuted" size="$3" />
                ))}
            </XStack>

            {expandedGroups[group.rating] && (
              <YStack gap="$1">
                {group.memos.map((memo) => (
                  <Typography
                    key={memo.id}
                    pressable
                    color="black"
                    pointerEvents="box-only"
                    size="$3"
                    onPress={() => onMemoPress?.(memo)}
                  >
                    {memo.title}
                  </Typography>
                ))}
              </YStack>
            )}
          </YStack>

          {index < ratingGroups.length - 1 && (
            <Separator borderColor="$border" marginVertical="$3" />
          )}
        </YStack>
      ))}
    </YStack>
  );
}
