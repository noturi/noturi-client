import { RATING_INPUT_EMPTY_COLOR, RATING_INPUT_FILLED_COLOR } from '~/shared/config';
import { Star } from '~/shared/lib/icons';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const;
const HALF_HIT_AREA = { position: 'absolute', width: 17, height: 34, zIndex: 2 } as const;

export const RatingSelector = ({ rating, onRatingChange }: RatingSelectorProps) => (
  <View className="flex-row items-center gap-4">
    <View className="flex-row">
      {STAR_VALUES.map((value) => {
        const isFilled = rating >= value;
        const isHalfFilled = rating === value - 0.5;

        return (
          <View key={value} className="relative h-[34px] w-[34px] items-center justify-center">
            {/* 왼쪽 반쪽: 0.5점 단위 */}
            <Pressable
              style={[HALF_HIT_AREA, { left: 0 }]}
              onPress={() => onRatingChange(value - 0.5)}
            />
            {/* 오른쪽 반쪽: 정수 점수 */}
            <Pressable
              style={[HALF_HIT_AREA, { right: 0 }]}
              onPress={() => onRatingChange(value)}
            />

            {isFilled ? (
              <Star color={RATING_INPUT_FILLED_COLOR} fill={RATING_INPUT_FILLED_COLOR} size={28} />
            ) : (
              <Star color={RATING_INPUT_EMPTY_COLOR} fill={RATING_INPUT_EMPTY_COLOR} size={28} />
            )}

            {isHalfFilled && (
              <View className="absolute overflow-hidden" style={{ left: 3, width: 14, height: 28 }}>
                <Star
                  color={RATING_INPUT_FILLED_COLOR}
                  fill={RATING_INPUT_FILLED_COLOR}
                  size={28}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
    <Typography className="text-text-muted" variant="caption1">
      {rating > 0 ? `${rating} / 5` : '평점을 선택하세요'}
    </Typography>
  </View>
);
