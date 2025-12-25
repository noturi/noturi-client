import type { UICategory } from '~/entities/category/model/types';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

interface CategoryButtonProps {
  category: UICategory;
  onPress?: () => void;
}

export const CategoryButton = ({ category, onPress }: CategoryButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const { currentTheme } = useUserTheme();

  // 테마 색상
  const accentColor = rgbToHex(currentTheme.colors.accent);
  const surfaceBg = rgbToHex(currentTheme.colors.surface);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textSecondary = rgbToHex(currentTheme.colors.textSecondary);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);

  const isActive = category.active;

  return (
    <Pressable
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: pressed ? 0.95 : 1,
      })}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View
        className="flex-row items-center gap-2 rounded-4 border px-3 py-2"
        style={{
          backgroundColor: surfaceBg,
          borderColor: isActive ? accentColor : borderColor,
          opacity: isPressed ? 0.8 : 1,
        }}
      >
        <Typography
          style={{ color: isActive ? accentColor : textSecondary }}
          variant="caption1"
        >
          {category.name}
        </Typography>
        {category.count > 0 && (
          <Typography
            style={{ color: isActive ? accentColor : textMuted }}
            variant="caption1"
          >
            {category.count}
          </Typography>
        )}
      </View>
    </Pressable>
  );
};
