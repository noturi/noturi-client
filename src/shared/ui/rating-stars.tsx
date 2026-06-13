import { STAR_COLOR } from '~/shared/config';
import { Star } from '~/shared/lib/icons';

import { View } from 'react-native';

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <View className="flex-row items-center gap-1" pointerEvents="none">
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} color={STAR_COLOR} fill={STAR_COLOR} size={12} />
      ))}
    </View>
  );
}
