import { Star } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

import { Pressable, View } from 'react-native';

interface RatingChipsProps {
  selectedRating: number | undefined;
  onSelect: (rating: number | undefined) => void;
}

export function RatingChips({ selectedRating, onSelect }: RatingChipsProps) {
  const { currentTheme } = useUserTheme();
  const primaryColor = rgbToHex(currentTheme.colors.primary);
  const primaryTextColor = rgbToHex(currentTheme.colors.primaryText);
  const surfaceColor = rgbToHex(currentTheme.colors.surface);
  const textSecondary = rgbToHex(currentTheme.colors.textSecondary);
  const textPrimary = rgbToHex(currentTheme.colors.textPrimary);

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
                backgroundColor: isSelected ? primaryColor : surfaceColor,
              }}
              onPress={() => onSelect(selectedRating === rating ? undefined : rating)}
            >
              <Star color={starColor} fill={starColor} size={16} />
              <Typography color={isSelected ? primaryTextColor : textPrimary} variant="callout">
                {rating}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
