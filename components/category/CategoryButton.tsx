import { XStack } from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';

import { Typography } from '@/components/ui';
import type { UICategory } from '@/services/category/categoryService';

interface CategoryButtonProps {
  category: UICategory;
  onPress?: () => void;
}

export const CategoryButton = ({ category, onPress }: CategoryButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: pressed ? 0.95 : 1,
      })}
      onPress={onPress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
    >
      <XStack
        alignItems="center"
        backgroundColor={
          isHovered
            ? category.active
              ? '$primaryHover'
              : '$surfaceHover'
            : category.active
              ? '$textPrimary'
              : '$surface'
        }
        borderColor={
          isHovered
            ? category.active
              ? '$primaryHover'
              : '$borderHover'
            : category.active
              ? '$textPrimary'
              : '$border'
        }
        borderRadius="$7"
        borderWidth={1}
        gap="$2"
        paddingHorizontal="$3"
        paddingVertical="$2"
      >
        <Typography
          color={category.active ? '$textOnPrimary' : '$textSecondary'}
          pointerEvents="none"
          variant="subtitle"
        >
          {category.name}
        </Typography>
        {category.count > 0 && (
          <Typography
            color={category.active ? '$textOnPrimary' : '$textMuted'}
            pointerEvents="none"
            variant="subtitle"
          >
            {category.count}
          </Typography>
        )}
      </XStack>
    </Pressable>
  );
};
