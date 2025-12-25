import { Star } from 'lucide-react-native';

import { View } from 'react-native';

import { Typography } from './typography';

interface StarRatingProps {
  rating: number;
}

const RATING_CONFIG = {
  0: { color: '#9e9e9e', bgColor: 'bg-rating-0-bg' }, // 회색 (평가 안함)
  1: { color: '#ff6b35', bgColor: 'bg-rating-1-bg' }, // 주황 (나쁨)
  2: { color: '#ffa726', bgColor: 'bg-rating-2-bg' }, // 노랑 (부족함)
  3: { color: '#9ccc65', bgColor: 'bg-rating-3-bg' }, // 연두 (보통)
  4: { color: '#66bb6a', bgColor: 'bg-rating-4-bg' }, // 초록 (좋음)
  5: { color: '#42a5f5', bgColor: 'bg-rating-5-bg' }, // 파랑 (최고)
} as const;

const RATING_TEXT_COLORS = {
  0: 'text-text-muted',
  1: 'text-rating-1',
  2: 'text-rating-2',
  3: 'text-rating-3',
  4: 'text-rating-4',
  5: 'text-rating-5',
} as const;

const getRatingConfig = (rating: number) => {
  const integerPart = Math.floor(rating) as keyof typeof RATING_CONFIG;
  return RATING_CONFIG[integerPart] || RATING_CONFIG[0];
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

  const config = getRatingConfig(safeRating);
  const textColorClass = getRatingTextColor(safeRating);

  return (
    <View className={`flex-row items-center gap-2 rounded-4 px-2 py-2 ${config.bgColor}`}>
      <Star color={config.color} fill={config.color} size={12} />
      <Typography className={textColorClass} variant="caption1">
        {safeRating.toFixed(1)}
      </Typography>
    </View>
  );
}
