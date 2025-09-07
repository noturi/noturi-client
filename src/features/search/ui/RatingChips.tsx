import { Button, XStack, YStack, useTheme } from 'tamagui';
import { Typography } from '~/shared/ui';

import { Star } from '@tamagui/lucide-icons';

interface RatingChipsProps {
  selectedRating: number | undefined;
  onSelect: (rating: number | undefined) => void;
}

export function RatingChips({ selectedRating, onSelect }: RatingChipsProps) {
  const theme = useTheme();
  const starColor = (theme.rating2 as any)?.get?.() ?? theme.textPrimary.get();
  return (
    <YStack gap="$1">
      <Typography variant="subtitle">평점</Typography>
      <XStack gap="$1">
        {[5, 4, 3, 2, 1].map((rating) => (
          <Button
            key={rating}
            alignItems="center"
            backgroundColor={selectedRating === rating ? '$primary' : '$surface'}
            borderRadius="$5"
            color={selectedRating === rating ? '$textOnPrimary' : '$textSecondary'}
            display="flex"
            height={32}
            justifyContent="center"
            paddingHorizontal="$1"
            onPress={() => onSelect(selectedRating === rating ? undefined : rating)}
          >
            <XStack alignItems="center" gap="$0">
              <Star color={starColor} fill={starColor} size="$3" />
              <Typography
                color={selectedRating === rating ? '$textOnPrimary' : '$textPrimary'}
                pointerEvents="none"
                variant="subtitle"
              >
                {rating}
              </Typography>
            </XStack>
          </Button>
        ))}
      </XStack>
    </YStack>
  );
}
