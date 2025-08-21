import { XStack, YStack } from 'tamagui';

import { useState } from 'react';
import { Pressable } from 'react-native';

import { Typography } from '@/components/ui';
import type { SortOption } from '@/lib/category/types';

interface SortButtonProps {
  option: SortOption;
  onPress?: () => void;
}

export const SortButton = ({ option, onPress }: SortButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      onPress={onPress}
      onPressIn={() => {
        setIsHovered(true);
        setIsPressed(true);
      }}
      onPressOut={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
    >
      <YStack position="relative">
        <XStack
          alignItems="center"
          backgroundColor={isHovered && !isPressed ? '$surfaceHover' : undefined}
          justifyContent="center"
          minHeight={48}
          minWidth={60}
          paddingHorizontal="$2.5"
          paddingVertical="$2.5"
          style={{
            transform: [{ scale: isPressed ? 0.96 : 1 }],
          }}
        >
          <Typography
            color={option.active ? '$textPrimary' : '$textSecondary'}
            fontWeight={option.active ? '$4' : '$3'}
            pointerEvents="none"
            style={{
              opacity: isPressed ? 0.8 : 1,
            }}
            variant="caption1"
          >
            {option.name}
          </Typography>
        </XStack>
        {option.active && (
          <XStack
            backgroundColor="$textPrimary"
            borderRadius="$1"
            bottom={0}
            height={2}
            left={0}
            position="absolute"
            right={0}
          />
        )}
      </YStack>
    </Pressable>
  );
};
