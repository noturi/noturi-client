import { STAR_COLOR } from '~/shared/config';
import { Star } from '~/shared/lib/icons';

import { View } from 'react-native';

import { Typography } from './typography';

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  // 모든 가능한 케이스를 처리하여 안전한 숫자로 변환
  let safeRating = 0;

  if (typeof rating === 'number' && !isNaN(rating)) {
    safeRating = rating;
  } else if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    safeRating = !isNaN(parsed) ? parsed : 0;
  }

  return (
    <View className="flex-row items-center gap-2 rounded-4 bg-surface px-2 py-2">
      <Star color={STAR_COLOR} fill={STAR_COLOR} size={12} />
      <Typography className="text-text-primary" variant="caption1">
        {safeRating.toFixed(1)}
      </Typography>
    </View>
  );
}
