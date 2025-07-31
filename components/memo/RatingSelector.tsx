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
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating === i - 0.5;
      const isEmpty = rating < i - 0.5;

      stars.push(
        <XStack
          key={i}
          alignItems="center"
          width={30}
          height={30}
          position="relative"
        >
          {/* 왼쪽 반쪽 클릭 영역 */}
          <Pressable
            onPress={() => onRatingChange(i - 0.5)}
            style={{
              position: "absolute",
              left: 0,
              width: 15,
              height: 30,
              zIndex: 2,
            }}
          />

          {/* 오른쪽 반쪽 클릭 영역 */}
          <Pressable
            onPress={() => onRatingChange(i)}
            style={{
              position: "absolute",
              right: 0,
              width: 15,
              height: 30,
              zIndex: 2,
            }}
          />

          {/* 완전 채워진 별 */}
          {isFilled && <Star size={30} color="$rating2" fill="#f59e0b" />}

          {/* 반쪽 채워진 별 */}
          {isHalfFilled && (
            <>
              {/* 전체 배경 (연한 노란색) */}
              <Star size={30} color="$rating2Light" fill="#fef3c7" />
              {/* 왼쪽 반쪽 진한 채움 */}
              <XStack
                position="absolute"
                width={15}
                height={30}
                left={0}
                overflow="hidden"
              >
                <Star size={30} color="$rating2" fill="#f59e0b" />
              </XStack>
            </>
          )}

          {/* 빈 별 */}
          {isEmpty && <Star size={30} color="$rating2Light" fill="#fef3c7" />}
        </XStack>
      );
    }
    return stars;
  };

  return (
    <YStack gap="$3">
      <Typography variant="title">평점</Typography>
      <XStack alignItems="center" gap="$2">
        <XStack gap="$1">{renderStars()}</XStack>
        <Typography variant="small" color="$textMuted">
          {rating > 0 ? `${rating} / 5` : "평점을 선택하세요"}
        </Typography>
      </XStack>
    </YStack>
  );
};
