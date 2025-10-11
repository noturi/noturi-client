import { XStack, useTheme } from 'tamagui';

import { Star } from '@tamagui/lucide-icons';

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  const theme = useTheme();

  return (
    <XStack alignItems="center" gap="$1" pointerEvents="none">
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} color="$star" fill={theme.star.val} size="$3" />
      ))}
    </XStack>
  );
}
