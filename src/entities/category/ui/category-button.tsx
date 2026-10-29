import { Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { UICategory } from '../model/types';

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
        // 선택: 꽉 채움 / 미선택: 밝은 글자 — 다크 모드에서 칩 배경이 화면 배경과 비슷해 흐려 보이지 않게
        className={`flex-row items-center justify-center gap-2 rounded-4 border px-3 py-2 ${
          isActive ? 'border-primary bg-primary' : 'border-border bg-surface'
        }`}
        style={{ opacity: isPressed ? 0.8 : 1 }}
      >
        <Typography
          className={isActive ? 'text-primary-text' : 'text-text-primary'}
          variant="caption1"
          weight={isActive ? 'semibold' : undefined}
        >
          {category.name}
        </Typography>
        {category.count > 0 && (
          <Typography
            className={isActive ? 'text-primary-text' : 'text-text-muted'}
            variant="caption1"
          >
            {category.count}
          </Typography>
        )}
      </View>
    </Pressable>
  );
};
