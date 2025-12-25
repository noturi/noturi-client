import { Star } from 'lucide-react-native';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

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
        <View key={i} className="relative h-[30px] w-[30px] items-center">
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

          {isFilled && <Star color="#f59e0b" fill="#f59e0b" size={24} />}

          {isHalfFilled && (
            <>
              <Star color="#fef3c7" fill="#fef3c7" size={24} />
              <View className="absolute left-0 h-[30px] w-[15px] overflow-hidden">
                <Star color="#f59e0b" fill="#f59e0b" size={24} />
              </View>
            </>
          )}

          {isEmpty && <Star color="#fef3c7" fill="#fef3c7" size={24} />}
        </View>,
      );
    }
    return stars;
  };

  return (
    <View className="flex-row items-center gap-4">
      <View className="flex-row">{renderStars()}</View>
      <Typography className="text-text-muted" variant="caption1">
        {rating > 0 ? `${rating} / 5` : '평점을 선택하세요'}
      </Typography>
    </View>
  );
};
