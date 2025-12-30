import { Star } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface RatingChipsProps {
  selectedRating: number | undefined;
  onSelect: (rating: number | undefined) => void;
}

export function RatingChips({ selectedRating, onSelect }: RatingChipsProps) {
  const { hexColors } = useUserTheme();

  // Rating star color (amber)
  const starColor = '#f59e0b';

  return (
    <View className="gap-1">
      <Typography variant="callout">평점</Typography>
      <View className="flex-row gap-1">
        {[5, 4, 3, 2, 1].map((rating) => {
          const isSelected = selectedRating === rating;
          return (
            <Pressable
              key={rating}
              className="h-8 flex-row items-center justify-center gap-1 rounded-5 px-2"
              style={{
                backgroundColor: isSelected ? hexColors.primary : hexColors.surface,
              }}
              onPress={() => onSelect(selectedRating === rating ? undefined : rating)}
            >
              <Star color={starColor} fill={starColor} size={16} />
              <Typography
                color={isSelected ? hexColors.primaryText : hexColors.textPrimary}
                variant="callout"
              >
                {rating}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
