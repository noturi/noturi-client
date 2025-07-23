import { Typography } from "@/components/ui";
import { XStack } from "tamagui";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => (
  <XStack alignItems="center" space="$0.5">
    <Typography variant="caption" color="$warning">
      ⭐
    </Typography>
    <Typography variant="caption" color="$textMuted" fontWeight="$3">
      {rating}
    </Typography>
  </XStack>
);