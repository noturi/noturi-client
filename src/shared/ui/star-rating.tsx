import { Star } from 'lucide-react-native';

import { View } from 'react-native';

import { Typography } from './typography';

interface StarRatingProps {
  rating: number;
}

const RATING_COLORS = {
  0: '#9e9e9e', // 회색 (평가 안함)
  1: '#ff6b35', // 주황 (나쁨)
  2: '#ffa726', // 노랑 (부족함)
  3: '#9ccc65', // 연두 (보통)
  4: '#66bb6a', // 초록 (좋음)
  5: '#42a5f5', // 파랑 (최고)
} as const;

const RATING_TEXT_COLORS = {
  0: 'text-text-muted',
  1: 'text-rating-1',
  2: 'text-rating-2',
  3: 'text-rating-3',
  4: 'text-rating-4',
  5: 'text-rating-5',
} as const;

const getRatingColor = (rating: number) => {
  const integerPart = Math.floor(rating) as keyof typeof RATING_COLORS;
  return RATING_COLORS[integerPart] || RATING_COLORS[0];
};

const getRatingTextColor = (rating: number) => {
  const integerPart = Math.floor(rating) as keyof typeof RATING_TEXT_COLORS;
  return RATING_TEXT_COLORS[integerPart] || RATING_TEXT_COLORS[0];
};

export function StarRating({ rating }: StarRatingProps) {
  // 모든 가능한 케이스를 처리하여 안전한 숫자로 변환
  let safeRating = 0;

  if (typeof rating === 'number' && !isNaN(rating)) {
    safeRating = rating;
  } else if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    safeRating = !isNaN(parsed) ? parsed : 0;
  }

  const ratingColor = getRatingColor(safeRating);
  const textColorClass = getRatingTextColor(safeRating);

  return (
    <View className="flex-row items-center gap-2 rounded-4 bg-surface px-2 py-2">
      <Star color={ratingColor} fill={ratingColor} size={12} />
      <Typography className={textColorClass} variant="caption1">
        {safeRating.toFixed(1)}
      </Typography>
    </View>
  );
}
