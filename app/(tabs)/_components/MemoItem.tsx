import { Typography } from "@/components/ui";
import { XStack, YStack } from "tamagui";
import { StarRating } from "./StarRating";
import { Memo } from "./types";

interface MemoItemProps {
  memo: Memo;
}

export const MemoItem = ({ memo }: MemoItemProps) => (
  <YStack
    paddingHorizontal="$4"
    paddingVertical="$3"
    backgroundColor="$backgroundPrimary"
    pressStyle={{
      backgroundColor: "$surfaceHover",
    }}
  >
    <XStack
      justifyContent="space-between"
      alignItems="flex-start"
      marginBottom="$2"
    >
      <YStack flex={1}>
        <XStack alignItems="center" space="$2" marginBottom="$1">
          <Typography
            as="span"
            variant="caption"
            color="$textPrimary"
            fontWeight="$3"
          >
            #{memo.category}
          </Typography>
          <Typography as="span" variant="caption" color="$textMuted">
            {memo.timeAgo}
          </Typography>
        </XStack>
        <Typography
          as="h4"
          variant="title"
          color="$textPrimary"
          marginBottom="$2"
          fontWeight="$4"
        >
          {memo.title}
        </Typography>
      </YStack>
      <XStack alignItems="center" space="$2">
        <StarRating rating={memo.rating} />
      </XStack>
    </XStack>

    <Typography as="p" variant="body" color="$textSecondary" lineHeight="$1">
      {memo.content}
    </Typography>
  </YStack>
);
