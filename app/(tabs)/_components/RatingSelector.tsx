import { Typography } from "@/components/ui";
import { Star } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { XStack, YStack } from "tamagui";

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSelector = ({
  rating,
  onRatingChange,
}: RatingSelectorProps) => {
  const getStarColor = () => {
    return "$warning"; // 선택할 때는 모두 같은 색상 (노랑)
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating === i - 0.5;

      // 반쪽 별의 색상
      const halfStarColor =
        isFilled || isHalfFilled ? getStarColor() : "$border";
      // 전체 별의 색상
      const fullStarColor = isFilled ? getStarColor() : "$border";

      stars.push(
        <XStack key={i} alignItems="center">
          <Pressable
            onPress={() => onRatingChange(i - 0.5)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={halfStarColor as any}
              fill={(isFilled || isHalfFilled ? halfStarColor : "transparent") as any}
              style={{ marginLeft: 0 }}
            />
          </Pressable>

          <Pressable
            onPress={() => onRatingChange(i)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={fullStarColor as any}
              fill={(isFilled ? fullStarColor : "transparent") as any}
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
        <Typography variant="small" color="$textMuted">
          {rating > 0 ? `${rating}/5` : "평점을 선택하세요"}
        </Typography>
      </XStack>
    </YStack>
  );
};
