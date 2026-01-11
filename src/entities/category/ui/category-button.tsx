import type { UICategory } from '~/entities/category/model/types';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

interface CategoryButtonProps {
  category: UICategory;
  onPress?: () => void;
}

export const CategoryButton = ({ category, onPress }: CategoryButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

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
        className={`flex-row items-center justify-center gap-2 rounded-4 border bg-surface px-3 py-2 ${
          isActive ? 'border-selection' : 'border-border'
        }`}
        style={{ opacity: isPressed ? 0.8 : 1 }}
      >
        <Typography
          className={isActive ? 'text-selection' : 'text-text-secondary'}
          variant="caption1"
        >
          {category.name}
        </Typography>
        {category.count > 0 && (
          <Typography
            className={isActive ? 'text-selection' : 'text-text-muted'}
            variant="caption1"
          >
            {category.count}
          </Typography>
        )}
      </View>
    </Pressable>
  );
};
