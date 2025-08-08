import { Typography } from "@/components/ui";
import { HREFS } from "@/constants";
import type { UIMemo } from "@/services/memo/memoService";
import { router } from "expo-router";
import { XStack, YStack } from "tamagui";
import { StarRating } from "./StarRating";

interface MemoItemProps {
  memo: UIMemo;
}

export const MemoItem = ({ memo }: MemoItemProps) => (
  <YStack
    paddingHorizontal="$4"
    paddingVertical="$3"
    backgroundColor="$backgroundPrimary"
    pressStyle={{
      backgroundColor: "$surfaceHover",
      opacity: 0.8,
    }}
    onPress={() => {
      router.push(HREFS.memoDetail(memo.id));
    }}
    cursor="pointer"
  >
    <XStack
      justifyContent="space-between"
      alignItems="flex-start"
      marginBottom="$2"
    >
      <YStack flex={1}>
        <XStack alignItems="center" gap="$2" marginBottom="$2">
          <YStack
            backgroundColor={memo.category.color as any}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$3"
          >
            <Typography
              variant="caption"
              color="white"
              fontWeight="$4"
              fontSize="$2"
              pointerEvents="none"
            >
              {memo.category.name}
            </Typography>
          </YStack>
          <Typography
            as="span"
            variant="caption"
            color="$textMuted"
            pointerEvents="none"
          >
            {memo.timeAgo}
          </Typography>
        </XStack>
        <Typography
          as="h4"
          variant="title"
          color="$textPrimary"
          marginBottom="$2"
          fontWeight="$4"
          pointerEvents="none"
          numberOfLines={1}
        >
          {memo.title}
        </Typography>
      </YStack>
      <XStack alignItems="center" gap="$2" pointerEvents="none">
        <StarRating rating={memo.rating} />
      </XStack>
    </XStack>

    <Typography
      as="p"
      variant="body"
      color="$textSecondary"
      lineHeight="$1"
      pointerEvents="none"
      numberOfLines={2}
    >
      {memo.content}
    </Typography>
  </YStack>
);
