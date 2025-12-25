import type { SortOption } from '~/entities/category/model/types';
import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

interface SortButtonProps {
  option: SortOption;
  onPress?: () => void;
}

export const SortButton = ({ option, onPress }: SortButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View className="relative">
        <View
          className="items-center justify-center min-h-[48px] min-w-[60px] px-2 py-2"
          style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
        >
          <Typography
            className={option.active ? 'text-text-primary font-medium' : 'text-text-secondary'}
            style={{ opacity: isPressed ? 0.8 : 1 }}
            variant="caption1"
          >
            {option.name}
          </Typography>
        </View>
        {option.active && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary rounded-1" />
        )}
      </View>
    </Pressable>
  );
};
