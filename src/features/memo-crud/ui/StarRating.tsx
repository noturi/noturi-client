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

export const StarRating = ({ rating }: StarRatingProps) => {
  const theme = useTheme();
  const config = getRatingConfig(rating);
  const starColor = theme[config.colorKey as keyof typeof theme]?.get();

  return (
    <XStack
      alignItems="center"
      backgroundColor={config.bgColor}
      borderRadius="$3"
      gap="$1"
      paddingHorizontal="$2"
      paddingVertical="$1"
    >
      <Star color={starColor} fill={starColor} size={16} />
      <Typography color={`$${config.colorKey}`} fontWeight="$4" variant="caption1">
        {rating.toFixed(1)}
      </Typography>
    </XStack>
  );
};
