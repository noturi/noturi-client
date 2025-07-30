import { Typography } from "@/components/ui";
import { useState } from "react";
import { Pressable } from "react-native";
import { XStack, YStack } from "tamagui";
import { SortOption } from "./types";

interface SortButtonProps {
  option: SortOption;
  onPress?: () => void;
}

export const SortButton = ({ option, onPress }: SortButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        setIsHovered(true);
        setIsPressed(true);
      }}
      onPressOut={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
    >
      <YStack position="relative">
        <XStack
          backgroundColor={
            isHovered && !isPressed ? "$surfaceHover" : undefined
          }
          paddingHorizontal="$2.5"
          paddingVertical="$2.5"
          alignItems="center"
          justifyContent="center"
          minWidth={60}
          minHeight={48}
          style={{
            transform: [{ scale: isPressed ? 0.96 : 1 }],
          }}
        >
          <Typography
            variant="subtitle"
            color={option.active ? "$textPrimary" : "$textSecondary"}
            fontWeight={option.active ? "$4" : "$3"}
            pointerEvents="none"
            style={{
              opacity: isPressed ? 0.8 : 1,
            }}
          >
            {option.name}
          </Typography>
        </XStack>
        {option.active && (
          <XStack
            height={2}
            backgroundColor="$textPrimary"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            borderRadius="$1"
          />
        )}
      </YStack>
    </Pressable>
  );
};
