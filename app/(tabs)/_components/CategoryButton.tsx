import { Typography } from "@/components/ui";
import type { UICategory } from "@/services/category/categoryService";
import { useState } from "react";
import { Pressable } from "react-native";
import { XStack } from "tamagui";

interface CategoryButtonProps {
  category: UICategory;
  onPress?: () => void;
}

export const CategoryButton = ({ category, onPress }: CategoryButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <XStack
        backgroundColor={
          isHovered
            ? category.active
              ? "$primaryHover"
              : "$surfaceHover"
            : category.active
            ? "$textPrimary"
            : "$surface"
        }
        paddingHorizontal="$3"
        paddingVertical="$2"
        borderRadius="$5"
        alignItems="center"
        borderWidth={1}
        borderColor={
          isHovered
            ? category.active
              ? "$primaryHover"
              : "$borderHover"
            : category.active
            ? "$textPrimary"
            : "$border"
        }
        gap="$2"
        minHeight={40}
        flexShrink={0}
      >
        <Typography
          variant="subtitle"
          color={category.active ? "$textOnPrimary" : "$textSecondary"}
          pointerEvents="none"
        >
          {category.name}
        </Typography>
        <Typography
          variant="subtitle"
          color={category.active ? "$textOnPrimary" : "$textMuted"}
          pointerEvents="none"
        >
          {category.count}
        </Typography>
      </XStack>
    </Pressable>
  );
};
