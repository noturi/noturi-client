import { XStack, useTheme } from 'tamagui';
import { Typography } from '~/shared/ui';

import { Star } from '@tamagui/lucide-icons';

interface StarRatingProps {
  rating: number;
}

const RATING_CONFIG = {
  0: { colorKey: 'textMuted', bgColor: '$rating0Background' }, // 회색 (평가 안함)
  1: { colorKey: 'rating1', bgColor: '$rating1Background' }, // 주황 (나쁨)
  2: { colorKey: 'rating2', bgColor: '$rating2Background' }, // 노랑 (부족함)
  3: { colorKey: 'rating3', bgColor: '$rating3Background' }, // 연두 (보통)
  4: { colorKey: 'rating4', bgColor: '$rating4Background' }, // 초록 (좋음)
  5: { colorKey: 'rating5', bgColor: '$rating5Background' }, // 파랑 (최고)
} as const;

const getRatingConfig = (rating: number) => {
  const integerPart = Math.floor(rating) as keyof typeof RATING_CONFIG;
  return RATING_CONFIG[integerPart] || RATING_CONFIG[0];
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

  const theme = useTheme();
  const config = getRatingConfig(safeRating);
  const starColor = theme[config.colorKey as keyof typeof theme]?.val;

  return (
    <XStack
      alignItems="center"
      backgroundColor={config.bgColor}
      borderRadius="$4"
      gap="$2"
      paddingHorizontal="$2"
      paddingVertical="$2"
    >
      <Star color={starColor} fill={starColor} size="$3" />
      <Typography color={`$${config.colorKey}`} variant="caption1">
        {safeRating.toFixed(1)}
      </Typography>
    </XStack>
  );
}
