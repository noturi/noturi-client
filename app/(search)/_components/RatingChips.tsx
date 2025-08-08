import { Button, XStack, YStack, useTheme } from 'tamagui';

import { Star } from '@tamagui/lucide-icons';

import { Typography } from '@/components/ui';

interface RatingChipsProps {
  selectedRating: number | undefined;
  onSelect: (rating: number | undefined) => void;
}

export function RatingChips({ selectedRating, onSelect }: RatingChipsProps) {
  const theme = useTheme();
  const starColor = (theme.rating2 as any)?.get?.() ?? theme.textPrimary.get();
  return (
    <YStack gap="$2">
      <Typography variant="subtitle">평점</Typography>
      <XStack gap="$2">
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
            paddingHorizontal="$2"
            onPress={() => onSelect(selectedRating === rating ? undefined : rating)}
          >
            <XStack alignItems="center" gap="$1">
              <Star color={starColor} fill={starColor} size={16} />
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
