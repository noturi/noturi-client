import { XStack, YStack } from 'tamagui';
import type { UIMemo } from '~/entities/memo/model/types';
import { HREFS } from '~/shared/constants';
import { Typography } from '~/shared/ui';

import { router } from 'expo-router';

import { StarRating } from './StarRating';

interface MemoItemProps {
  memo: UIMemo;
}

export const MemoItem = ({ memo }: MemoItemProps) => (
  <YStack
    backgroundColor="$backgroundPrimary"
    cursor="pointer"
    paddingHorizontal="$4"
    paddingVertical="$sm"
    pressStyle={{
      backgroundColor: '$surfaceHover',
      opacity: 0.8,
    }}
    onPress={() => {
      router.push(HREFS.memoDetail(memo.id));
    }}
  >
    <XStack alignItems="flex-start" justifyContent="space-between" marginBottom="$2">
      <YStack flex={1}>
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          <YStack
            backgroundColor={memo.category.color as any}
            borderRadius="$sm"
            paddingHorizontal="$2"
            paddingVertical="$1"
          >
            <Typography
              color="white"
              fontSize="$sm"
              fontWeight="$medium"
              pointerEvents="none"
              variant="caption1"
            >
              {memo.category.name}
            </Typography>
          </YStack>
          <Typography as="span" color="$textMuted" pointerEvents="none" variant="caption1">
            {memo.timeAgo}
          </Typography>
        </XStack>
        <Typography
          color="$textPrimary"
          fontWeight="$medium"
          marginBottom="$2"
          numberOfLines={1}
          pointerEvents="none"
          variant="subtitle"
        >
          {memo.title}
        </Typography>
      </YStack>
      <XStack alignItems="center" gap="$2" pointerEvents="none">
        <StarRating rating={memo.rating} />
      </XStack>
    </XStack>

    <Typography
      color="$textSecondary"
      lineHeight="$1"
      numberOfLines={2}
      pointerEvents="none"
      variant="caption1"
    >
      {memo.content}
    </Typography>
  </YStack>
);
