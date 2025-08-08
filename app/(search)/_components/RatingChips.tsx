import { Button, ScrollView, XStack, YStack } from 'tamagui';

import { Typography } from '@/components/ui';

interface RatingChipsProps {
  selectedRating: number | undefined;
  onSelect: (rating: number | undefined) => void;
}

export function RatingChips({ selectedRating, onSelect }: RatingChipsProps) {
  return (
    <YStack gap="$2">
      <Typography fontSize="$3" variant="title">
        평점
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2">
          <Button
            backgroundColor={selectedRating === undefined ? '$primary' : '$surface'}
            borderRadius="$5"
            color={selectedRating === undefined ? '$textOnPrimary' : '$textSecondary'}
            size="$3"
            onPress={() => onSelect(undefined)}
          >
            전체
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              backgroundColor={selectedRating === rating ? '$primary' : '$surface'}
              borderRadius="$5"
              color={selectedRating === rating ? '$textOnPrimary' : '$textSecondary'}
              size="$3"
              onPress={() => onSelect(rating)}
            >
              ★ {rating}+
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
