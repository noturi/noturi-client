import { XStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { Pressable } from 'react-native';

import { Star } from '@tamagui/lucide-icons';

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSelector = ({ rating, onRatingChange }: RatingSelectorProps) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating === i - 0.5;
      const isEmpty = rating < i - 0.5;

      stars.push(
        <XStack key={i} alignItems="center" height={30} position="relative" width={30}>
          {/* 왼쪽 반쪽 클릭 영역 */}
          <Pressable
            style={{
              position: 'absolute',
              left: 0,
              width: 15,
              height: 30,
              zIndex: 2,
            }}
            onPress={() => onRatingChange(i - 0.5)}
          />

          {/* 오른쪽 반쪽 클릭 영역 */}
          <Pressable
            style={{
              position: 'absolute',
              right: 0,
              width: 15,
              height: 30,
              zIndex: 2,
            }}
            onPress={() => onRatingChange(i)}
          />

          {/* 완전 채워진 별 */}
          {isFilled && <Star color="$rating2" fill="#f59e0b" size="$2xl" />}

          {/* 반쪽 채워진 별 */}
          {isHalfFilled && (
            <>
              {/* 전체 배경 (연한 노란색) */}
              <Star color="$rating2Light" fill="#fef3c7" size="$2xl" />
              {/* 왼쪽 반쪽 진한 채움 */}
              <XStack height={30} left={0} overflow="hidden" position="absolute" width={15}>
                <Star color="$rating2" fill="#f59e0b" size="$2xl" />
              </XStack>
            </>
          )}

          {/* 빈 별 */}
          {isEmpty && <Star color="$rating2Light" fill="#fef3c7" size="$2xl" />}
        </XStack>,
      );
    }
    return stars;
  };

  return (
    <XStack alignItems="center" gap="$2">
      <XStack gap="$1">{renderStars()}</XStack>
      <Typography color="$textMuted" variant="caption2">
        {rating > 0 ? `${rating} / 5` : '평점을 선택하세요'}
      </Typography>
    </XStack>
  );
};
