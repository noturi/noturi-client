import { Typography } from "@/components/ui";
import { Star } from "@tamagui/lucide-icons";
import { XStack, useTheme } from "tamagui";

interface StarRatingProps {
  rating: number;
}

const getStarColorKey = (rating: number) => {
  // 점수 구간별 색상 키 결정
  if (rating === 0) {
    return "textMuted";
  } else if (rating >= 0.1 && rating <= 2.5) {
    return "error";
  } else if (rating >= 2.6 && rating <= 4.5) {
    return "warning";
  } else {
    return "success";
  }
};

export const StarRating = ({ rating }: StarRatingProps) => {
  const theme = useTheme();
  const colorKey = getStarColorKey(rating);
  const starColor = theme[colorKey as keyof typeof theme]?.get();

  return (
    <XStack alignItems="center" space="$1">
      <Star
        size={16}
        color={starColor}
        fill={rating > 0 ? starColor : "transparent"}
      />
      <Typography variant="small" color={`$${colorKey}`} fontWeight="$4">
        {rating.toFixed(1)}
      </Typography>
    </XStack>
  );
};
