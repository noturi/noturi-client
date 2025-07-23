import { Typography } from "@/components/ui";
import { XStack } from "tamagui";
import { Category } from "./types";

interface CategoryButtonProps {
  category: Category;
}

export const CategoryButton = ({ category }: CategoryButtonProps) => (
  <XStack
    backgroundColor={category.active ? "$textPrimary" : "$surface"}
    paddingHorizontal="$2.5"
    paddingVertical="$1"
    borderRadius="$8"
    alignItems="center"
    space="$1"
    borderWidth={1}
    borderColor={category.active ? "$textPrimary" : "$border"}
    pressStyle={{
      scale: 0.95,
      backgroundColor: category.active ? "$primaryActive" : "$surfaceHover",
    }}
  >
    <Typography
      variant="caption"
      fontWeight="$3"
      color={category.active ? "$textOnPrimary" : "$textSecondary"}
    >
      {category.name}
    </Typography>
    <Typography
      variant="caption"
      fontWeight="$4"
      color={category.active ? "$textOnPrimary" : "$textMuted"}
    >
      {category.count}
    </Typography>
  </XStack>
);