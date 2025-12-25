import { View } from 'react-native';

import { Star } from 'lucide-react-native';

interface RatingStarsProps {
  rating: number;
}

// 테마에서 star 색상 사용 (accent와 동일)
const STAR_COLOR = '#ffc107';

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <View className="flex-row items-center gap-1" pointerEvents="none">
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} color={STAR_COLOR} fill={STAR_COLOR} size={12} />
      ))}
    </View>
  );
}
