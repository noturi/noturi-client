import { Typography } from "@/components/ui";
import { Star } from "@tamagui/lucide-icons";
import { XStack, useTheme } from "tamagui";

interface StarRatingProps {
  rating: number;
}

const getStarColorKey = (rating: number) => {
  // 일의 자리 숫자에 따라 전용 별점 색상 사용
  const integerPart = Math.floor(rating);
  switch (integerPart) {
    case 0: return "rating0"; // 0점대: 빨강 (최악)
    case 1: return "rating1"; // 1점대: 주황 (나쁨)
    case 2: return "rating2"; // 2점대: 노랑 (부족함)
    case 3: return "rating3"; // 3점대: 연두 (보통)
    case 4: return "rating4"; // 4점대: 초록 (좋음)
    case 5: return "rating5"; // 5점대: 파랑 (최고)
    default: return "textMuted";
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
