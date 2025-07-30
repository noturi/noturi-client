import { Typography } from "@/components/ui";
import { Star } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { XStack, YStack } from "tamagui";

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSelector = ({ rating, onRatingChange }: RatingSelectorProps) => {
  const getStarColor = (starRating: number) => {
    if (starRating <= 1) return "$error"; // 0, 0.5, 1점: 빨강
    if (starRating <= 2.5) return "$warning"; // 1.5, 2, 2.5점: 주황/노랑
    return "$accent"; // 3, 3.5, 4, 4.5, 5점: 파랑
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating === i - 0.5;
      const currentRating = isHalfFilled ? i - 0.5 : (isFilled ? i : 0);

      stars.push(
        <XStack key={i} alignItems="center">
          <Pressable
            onPress={() => onRatingChange(i - 0.5)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={isFilled || isHalfFilled ? getStarColor(currentRating) : "$border"}
              fill={isFilled || isHalfFilled ? getStarColor(currentRating) : "transparent"}
              style={{ marginLeft: 0 }}
            />
          </Pressable>

          <Pressable
            onPress={() => onRatingChange(i)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={isFilled ? getStarColor(i) : "$border"}
              fill={isFilled ? getStarColor(i) : "transparent"}
              style={{ marginLeft: -12 }}
            />
          </Pressable>
        </XStack>
      );
    }
    return stars;
  };

  return (
    <YStack gap="$3">
      <Typography variant="title">평점</Typography>
      <XStack alignItems="center" gap="$3">
        {renderStars()}
        <Typography variant="small" color="#666">
          {rating > 0 ? `${rating}/5` : "평점을 선택하세요"}
        </Typography>
      </XStack>
    </YStack>
  );
};