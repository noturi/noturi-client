import { ChevronRight } from '~/shared/lib/icons';
import { RatingStars, Skeleton, Typography } from '~/shared/ui';

import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import type { UIMemo } from '../model/types';

/*
 * 별점 구역을 가상화 리스트용 행으로 쪼갠 표시 컴포넌트.
 * 카드 없이 소제목(별점·개수) 아래 메모 행이 이어지는 가벼운 목록.
 * 데이터 조회는 소유하지 않는다 — 전부 props로 받는다.
 */

interface RatingSectionHeaderProps {
  rating: number;
  total: number;
  /** 있으면 오른쪽에 "전체 ›" — 보이는 메모보다 더 있을 때만 넘긴다 */
  onPressMore?: () => void;
}

export function RatingSectionHeader({ rating, total, onPressMore }: RatingSectionHeaderProps) {
  return (
    <View className="flex-row items-center gap-2 mb-1 border-b border-border pb-2">
      <View className="flex-1 flex-row items-center gap-2">
        {rating > 0 ? (
          <RatingStars rating={rating} />
        ) : (
          <Typography className="text-text-secondary" variant="footnote" weight="medium">
            별점 없음
          </Typography>
        )}
        <Typography className="text-text-muted" variant="caption1">
          {total}
        </Typography>
      </View>
      {onPressMore && (
        <Pressable
          className="flex-row items-center gap-1 active:opacity-60"
          hitSlop={8}
          onPress={onPressMore}
        >
          <Typography className="text-text-muted" variant="caption1">
            전체
          </Typography>
          <ChevronRight className="text-text-muted" size={12} />
        </Pressable>
      )}
    </View>
  );
}

interface RatingSectionMemoRowProps {
  memo: UIMemo;
  onPress: (memo: UIMemo) => void;
  /**
   * 제목(누르는 영역)을 감쌀 래퍼 — 예: 길게 누르기 메뉴.
   * 행 전체를 감싸면 네이티브 Host가 내용 폭으로 줄어 카테고리가 제목 옆에 붙으므로 제목만 감싼다
   */
  wrapTitle?: (title: ReactNode) => ReactNode;
}

export function RatingSectionMemoRow({ memo, onPress, wrapTitle }: RatingSectionMemoRowProps) {
  const title = (
    <Pressable className="py-1 active:opacity-60" onPress={() => onPress(memo)}>
      <Typography className="text-text-primary" numberOfLines={1} variant="callout">
        {memo.title}
      </Typography>
    </Pressable>
  );

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 flex-row">{wrapTitle ? wrapTitle(title) : title}</View>
      <Pressable className="py-1 active:opacity-60" onPress={() => onPress(memo)}>
        <Typography className="text-text-muted" numberOfLines={1} variant="caption1">
          {memo.category.name}
        </Typography>
      </Pressable>
    </View>
  );
}

export function RatingSectionSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2 pb-2">
        <Skeleton borderRadius={2} height={12} width={72} />
        <Skeleton borderRadius={4} height={12} width={20} />
      </View>
      <Skeleton borderRadius={4} height={18} width="70%" />
      <Skeleton borderRadius={4} height={18} width="55%" />
      <Skeleton borderRadius={4} height={18} width="62%" />
    </View>
  );
}
